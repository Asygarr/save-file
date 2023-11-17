import { PrismaClient } from "@prisma/client";

const primsa = new PrismaClient();

export const checkAuth = async (req, res, next) => {
  if (!req.session.user)
    return res.status(400).json({ massage: "Tolong login terlebih dahulu" });

  const dataMe = await primsa.user.findUnique({
    where: {
      uuid: req.session.user,
    },
  });

  if (!dataMe)
    return res.status(400).json({ massage: "User tidak ditemukan" });

  req.user = dataMe.uuid;
  next();
};
