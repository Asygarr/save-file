import { PrismaClient } from "@prisma/client";
import argon from "argon2";

const prisma = new PrismaClient();

export const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ massage: "Tolong di isi semua " });

  const loginUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!loginUser)
    return res.status(400).json({ massage: "Email tidak ditemukan" });

  const validasiPassword = await argon.verify(loginUser.password, password);

  if (!validasiPassword)
    return res.status(200).json({ massage: "Password salah" });

  req.session.user = loginUser.uuid;
  const dataLogin = await prisma.user.findUnique({
    where: {
      uuid: loginUser.uuid,
    },
    select: {
      uuid: true,
      email: true,
      name: true,
      img_profile: true,
    },
  });

  res.status(200).json({ massage: "Login berhasil", dataLogin });
};

export const Me = async (req, res) => {
  if (!req.session.user)
    return res.status(400).json({ massage: "Tolong login terlebih dahulu" });

  try {
    const dataMe = await prisma.user.findUnique({
      where: {
        uuid: req.session.user,
      },
      select: {
        uuid: true,
        email: true,
        name: true,
        img_profile: true,
      },
    });

    res.status(200).json({ massage: "Data user yang sedang login", dataMe });
  } catch (error) {
    res.status(500).json({ massage: error.message });
  }
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(404).json({ massage: err.massage });

    res.status(200).json({ massage: "Logout berhasil" });
  });
};
