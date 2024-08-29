import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
const router = Router();
const prisma = new PrismaClient();

router.post('/logged', (req, res) => {
  const { loggedToken } = req.cookies;
  if (loggedToken == undefined) {
    return res.send({ isLoggedIn: false });
  } else {
    return res.send({ isLoggedIn: true });
  }
});
router.post('/role', (req, res) => {
  const { loggedToken } = req.cookies;
  try {
    if (loggedToken == undefined) {
      return res.send({ isLoggedIn: false });
    } else {
      const tokenData = jwt.verify(loggedToken, process.env.SECRET_KEY);
      if (tokenData.rol == 'cliente') {
        return res.send({ isLoggedIn: false });
      } else if (tokenData.rol == 'admin') {
        return res.send({ isLoggedIn: true });
      }
    }
  } catch (err) {
    res.status(404).send({ err });
  }
});

export default router;
