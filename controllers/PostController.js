import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

export const getAllPost = async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      select: {
        uuid: true,
        title: true,
        content: true,
        img_post: true,
        url_post: true,
        user: {
          select: {
            name: true,
            email: true,
            img_profile: true,
            url_profile: true,
          },
        },
      },
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.post.findUnique({
      where: {
        uuid: id,
      },
      select: {
        uuid: true,
        title: true,
        content: true,
        img_post: true,
        url_post: true,
      },
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const userId = req.user;

  const { title, content } = req.body;

  if (!title || !content) {
    if (req.files) {
      req.files.map((files) => {
        fs.unlinkSync(files.path);
      });
    }

    return res.status(400).json({ message: "Tolong di isi terlebih dahulu" });
  }

  const images = req.files.map((img) => ({
    filename: img.filename,
  }));

  const urlImagePost = images.map((img) => {
    return `${req.protocol}://${req.get("host")}/images/posts/${img.filename}`;
  });

  try {
    const data = await prisma.post.create({
      data: {
        user_uuid: userId,
        title: title,
        content: content,
        img_post: images
          ? images.map((files) => files.filename).join(", ")
          : null,
        url_post: urlImagePost
          ? urlImagePost.map((img) => img).join(", ")
          : null,
      },
    });

    res.status(200).json({ message: "Post telah dibuat", data });
  } catch (error) {
    if (req.files) {
      req.files.map((img) => {
        fs.unlinkSync(img.path);
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  const { title, content } = req.body;

  if (!title || !content) {
    if (req.files) {
      req.files.map((files) => {
        fs.unlinkSync(files.path);
      });
    }

    return res.status(400).json({ message: "Tolong di isi terlebih dahulu" });
  }

  const cekPost = await prisma.post.findUnique({
    where: {
      uuid: id,
    },
  });

  if (!cekPost) {
    if (req.files) {
      req.files.map((files) => {
        fs.unlinkSync(files.path);
      });
    }

    return res.status(400).json({ message: "Post tidak ditemukan" });
  }

  if (cekPost.user_uuid !== req.user) {
    if (req.files) {
      req.files.map((files) => {
        fs.unlinkSync(files.path);
      });
    }

    return res.status(400).json({ message: "Post ini bukan milik anda" });
  }

  const images = req.files.map((img) => ({
    filename: img.filename,
  }));

  const urlImagePost = images.map((img) => {
    return `${req.protocol}://${req.get("host")}/images/posts/${img.filename}`;
  });

  if (req.files && cekPost.img_post) {
    const images = cekPost.img_post.split(", ");
    images.map((img) => {
      if (!fs.existsSync(`./public/images/posts/${img}`)) return;

      fs.unlinkSync(`./public/images/posts/${img}`);
    });
  }

  try {
    const data = await prisma.post.update({
      where: {
        uuid: id,
      },
      data: {
        user_uuid: req.user,
        title: title,
        content: content,
        img_post: images
          ? images.map((files) => files.filename).join(", ")
          : null,
        url_post: urlImagePost
          ? urlImagePost.map((img) => img).join(", ")
          : null,
      },
      select: {
        uuid: true,
        title: true,
        content: true,
        img_post: true,
        url_post: true,
        user: {
          select: {
            name: true,
            email: true,
            img_profile: true,
            url_profile: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Post berhasil diupdate", data });
  } catch (error) {
    if (req.files) {
      req.files.map((img) => {
        fs.unlinkSync(img.path);
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const cekPost = await prisma.post.findUnique({
      where: {
        uuid: id,
      },
    });

    if (!cekPost)
      return res.status(400).json({ message: "Post tidak ditemukan" });

    if (cekPost.user_uuid !== req.user)
      return res.status(400).json({ message: "Post ini bukan milik anda" });

    if (cekPost.img_post) {
      const images = cekPost.img_post.split(", ");
      images.map((img) => {
        if (!fs.existsSync(`./public/images/posts/${img}`)) return;

        fs.unlinkSync(`./public/images/posts/${img}`);
      });
    }

    const deletePost = await prisma.post.delete({
      where: {
        uuid: id,
      },
      select: {
        uuid: true,
        title: true,
        content: true,
        img_post: true,
        user: {
          select: {
            name: true,
            email: true,
            img_profile: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Post berhasil dihapus", deletePost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
