import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import romRoutes from './routes/roms.js';

const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api/roms', romRoutes(prisma));
app.use('/roms', express.static('roms'));

app.get('/', (req, res) => res.send('Server is running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));