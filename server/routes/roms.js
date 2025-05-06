import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'roms/' });

export default function (prisma) {
  const router = express.Router();

  // List ROMs
  router.get('/', async (req, res) => {
    const roms = await prisma.rom.findMany();
    res.json(roms);
  });

  // Upload ROM
  router.post('/upload', upload.single('rom'), async (req, res) => {
    const file = req.file;
    const title = req.body.title || file.originalname;

    const rom = await prisma.rom.create({
      data: {
        title,
        filename: file.filename,
        size: file.size,
      },
    });

    res.json(rom);
  });

  return router;
}