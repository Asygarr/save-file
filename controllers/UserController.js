import { PrismaClient } from "@prisma/client";
import argon from "argon2";
import fs from "fs";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
        url_profile: true,
      },
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.user.findUnique({
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
        url_profile: true,
      },
      where: {
        uuid: id,
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Data tidak boleh kosong" });
  }

  if (password !== confirmPassword) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const hashedPassword = await argon.hash(password);

  try {
    const image = req.file ? req.file.filename : null;
    const urlProfile = req.file
      ? `${req.protocol}://${req.get("host")}/images/users/${req.file.filename}`
      : null;

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        img_profile: image,
        url_profile: urlProfile,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
        url_profile: true,
      },
    });

    res.status(200).json({ message: "User berhasil di buat", data });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email sudah di gunakan" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Data tidak boleh kosong" });
  }

  const dataLama = await prisma.user.findUnique({
    where: {
      uuid: id,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      img_profile: true,
      url_profile: true,
    },
  });

  if (!dataLama) {
    return res.status(400).json({ message: "User tidak ditemukan" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const hashedPassword = await argon.hash(password);

  try {
    let urlProfile = "";
    let image = "";

    if (req.file) {
      const imagePath = `./public/images/${dataLama.img_profile}`;

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      image = req.file.filename;
      urlProfile = `${req.protocol}://${req.get("host")}/images/users/${
        req.file.filename
      }`;
    } else {
      image = dataLama.img_profile;
      urlProfile = dataLama.url_profile;
    }

    const data = await prisma.user.update({
      where: {
        uuid: id,
      },
      data: {
        name,
        email,
        password: hashedPassword,
        img_profile: image,
        url_profile: urlProfile,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        img_profile: true,
        url_profile: true,
      },
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      data,
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
