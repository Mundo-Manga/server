import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

router.delete('/detailsCartDelete', async (req, res) => {
  const codeDelete = req.query.id_detailCart;
  if (!codeDelete) {
    return res.status(400).send({
      success: false,
      message: 'El parámetro code es requerido',
    });
  }

  try {
    console.log(codeDelete);
    const deleteProduct = await prisma.detailsCart.delete({
      where: { id: parseInt(codeDelete) },
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
router.post('/detailsCartAdd', async (req, res) => {
  const { loggedToken } = req.cookies;
  const { code_producto } = req.body;
  const { cantidad } = req.body;

  try {
    const tokenData = jwt.verify(loggedToken, process.env.SECRET_KEY);

    const newDetail = await prisma.detailsCart.create({
      data: {
        id_detallesCarrito: cartId.id,
        codeProducto: code_producto,
        cant_producto: cantidad,
        subtotal: priceProduct.price * cantidad,
      },
    });
    res.send(true);
  } catch (err) {
    return res.status(404).send({ err });
  }
});

router.post('/getCart', async (req, res) => {
  const { loggedToken } = req.cookies;
  const { code_producto } = req.body;

  try {
    const tokenData = jwt.verify(loggedToken, process.env.SECRET_KEY);
    const cart = await prisma.cart.findUnique({
      where: { id_user: tokenData.id },
      include: {
        details: {
          include: {
            producto: true,
          },
        },
      },
    });
    return res.send({
      succes: true,
      message: 'Detalles de productos enviado con exito',
      detalles: cart.details,
    });
  } catch (err) {
    return res.status(404).send({ err });
  }
});

export default router;
