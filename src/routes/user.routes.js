import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

router.post('/getRole', (req, res) => {
  const { loggedToken } = req.cookies;

  try {
    const tokenData = jwt.verify(loggedToken, process.env.SECRET_KEY);
    if (tokenData.rol == 'cliente') {
      return res.send({ role: 'cliente' });
    } else if (tokenData.rol == 'admin') {
      return res.send({ role: 'admin' });
    }
  } catch (err) {
    res.status(404).send({ err });
  }
});
router.get('/logout', (req, res) => {
  try {
    return res
      .clearCookie('loggedToken')
      .send({ succes: true, message: 'Cerrando sesion...' });
  } catch (err) {
    return res.status(404).send({ err });
  }
});
router.get('/getUsers', async (req, res) => {
  const page = req.query.page;
  const itemsPerPage = 20;
  const skip = (page - 1) * itemsPerPage;
  const take = itemsPerPage;
  try {
    const getUsers = await prisma.user.findMany({
      skip: skip,
      take: take,
      select: {
        id: true,
        apellido: true,
        nombre: true,
        nombre_usuario: true,
        correo: true,
        rol: true,
      },
    });
    return res.send({
      succes: true,
      message: 'Enviando usuarios',
      users: getUsers,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});
router.delete('/deleteProduct', async (req, res) => {
  const codeDelete = req.query.code;
  if (!codeDelete) {
    return res.status(400).send({
      success: false,
      message: 'El parámetro code es requerido',
    });
  }

  try {
    console.log(codeDelete);
    const deleteProduct = await prisma.product.delete({
      where: { code_producto: codeDelete },
    });

    return res.send({
      success: true,
      message: 'Eliminado correctamente',
      data: deleteProduct,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: 'Error eliminando el producto',
      error: err.message,
    });
  }
});
export default router;
