import { PrismaClient } from "@prisma/client";
import argon from "argon2";

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
        id: Number(id),
      },
    });
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ massage: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword, image } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({ massage: "Password not match" });
  }

  const hashedPassword = await argon.hash(password);

};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};
