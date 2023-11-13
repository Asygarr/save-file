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

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Data tidak boleh kosong" });
  }

  if (password !== confirmPassword) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ massage: "Password tidak sama" });
  }

  const hashedPassword = await argon.hash(password);

  try {
    const createData = {
      name,
      email,
      password: hashedPassword,
    };

    if (req.file) {
      createData.img_profile = req.file.filename;
    }

    const response = await prisma.user.create({
      data: createData,
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
      },
    });

    res.status(200).json({ massage: "User berhasil di buat", data: response });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === "P2002") {
      return res.status(400).json({ massage: "Email sudah di gunakan" });
    }
    res.status(500).json({ massage: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Data tidak boleh kosong" });
  }

  const data = await prisma.user.findUnique({
    where: {
      uuid: id,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      img_profile: true,
    },
  });

  if (!data) {
    return res.status(400).json({ message: "User tidak ditemukan" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const hashedPassword = await argon.hash(password);

  try {
    const updateData = {
      name,
      email,
      password: hashedPassword,
    };

    if (req.file) {
      // cek apakah ada file sebelumnya
      if (fs.existsSync(`./public/images/${data.img_profile}`)) {
        fs.unlinkSync(`./public/images/${data.img_profile}`);
      }
      updateData.img_profile = req.file.filename;
    }

    const response = await prisma.user.update({
      where: {
        uuid: id,
      },
      data: updateData,
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
      },
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      data_lama: data,
      data_baru: response,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    res.status(500).json({ message: error.message });
  }
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
