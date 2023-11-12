import { PrismaClient } from "@prisma/client";
import argon from "argon2";
import fs from "fs";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const response = await prisma.user.findMany({
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
      },
    });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ massage: error.message });
  }
};

export const getUsersById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.user.findUnique({
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
      },
      where: {
        uuid: id,
      },
    });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ massage: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.file);

  if (!req.body || !req.file)
    return res.status(400).json({ massage: "Data tidak boleh kosong" });

  if (password !== confirmPassword) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ massage: "Password tidak sama" });
  }

  const hashedPassword = await argon.hash(password);

  try {
    const response = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        img_profile: req.file.filename,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
      },
    });

    res.status(200).json({ massage: "User berhasil di buat", data: response });
  } catch (error) {
    fs.unlinkSync(req.file.path);
    
    if (error.code === "P2002") {
      return res.status(400).json({ massage: "Email sudah di gunakan" });
    }
    res.status(500).json({ massage: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const response = await prisma.user.findUnique({
    where: {
      uuid: id,
    },
  });

  if (!response)
    return res.status(400).json({ massage: "User tidak di temukan" });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const response = await prisma.user.findUnique({
    where: {
      uuid: id,
    },
  });

  if (!response)
    return res.status(400).json({ massage: "User tidak di temukan" });

  try {
    await prisma.user.delete({
      where: {
        uuid: id,
      },
    });

    res.status(200).json({ massage: "User berhasil di hapus" });
  } catch (error) {
    res.status(500).json({ massage: error.message });
  }
};
