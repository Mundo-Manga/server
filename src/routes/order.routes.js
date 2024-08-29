import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

router.get('/countOrder', async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { estado: 'pending' },
    });
    const confirmedOrders = await prisma.order.count({
      where: { estado: 'confirm' },
    });

    res.send({
      totalOrders,
      pendingOrders,
      confirmedOrders,
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/confirmOrder', async (req, res) => {
  const { idOrder } = req.query;
  try {
    const confirmOrder = await prisma.order.update({
      where: { id: parseInt(idOrder) },
      data: {
        estado: 'confirm',
      },
    });
    return res.send({
      succes: true,
      message: 'pedido confirmada exitosamente',
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ err });
  }
});
router.delete('/deleteOrder', async (req, res) => {
  const { idOrder } = req.query;

  try {
    await prisma.detailsOrder.deleteMany({
      where: {
        id_order: parseInt(idOrder),
      },
    });
    const deleteOrder = await prisma.order.delete({
      where: { id: parseInt(idOrder) },
    });
    return res.send({ succes: true, message: 'Pedido eliminado exitosamente' });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ err });
  }
});
router.post('/createOrder', async (req, res) => {
  const montoTotal = req.body.montoTotal;
  const { loggedToken } = req.cookies;

  try {
    const tokenData = jwt.verify(loggedToken, process.env.SECRET_KEY);

    const findUser = await prisma.user.findUnique({
      where: { id: tokenData.id },
      select: { carritos: true },
    });

    if (!findUser || !findUser.carritos) {
      return res
        .status(404)
        .send({ error: 'Usuario o carrito no encontrado.' });
    }

    const cartData = await prisma.detailsCart.findMany({
      where: { id_detallesCarrito: findUser.carritos.id },
      select: {
        id: true,
        cant_producto: true,
        subtotal: true,
        codeProducto: true,
      },
    });

    if (!cartData || cartData.length === 0) {
      return res.status(404).send({ error: 'Carrito está vacío.' });
    }

    await prisma.$transaction(async (prisma) => {
      // Crear la orden
      const createOrder = await prisma.order.create({
        data: {
          id_usuario: findUser.carritos.id_user,
          monto_total: montoTotal,
        },
      });

      for (const item of cartData) {
        await prisma.detailsOrder.create({
          data: {
            id_order: createOrder.id,
            codeProducto: item.codeProducto,
            subtotal: item.subtotal,
            cantidad: item.cant_producto,
          },
        });
      }

      await prisma.detailsCart.deleteMany({
        where: { id_detallesCarrito: findUser.carritos.id },
      });
    });

    res.send(true);
  } catch (err) {
    console.error('Error al crear la orden y detalles:', err);
    res.status(500).send({ error: 'Hubo un problema al procesar la orden.' });
  }
});

router.get('/getOrder', async (req, res) => {
  try {
    const findOrder = await prisma.order.findMany({
      include: {
        detailsOrder: {
          include: {
            producto: true,
          },
        },
        user: true,
      },
    });
    function formatFechaHora(fechaISO) {
      const fecha = new Date(fechaISO);

      const dia = fecha.getUTCDate().toString().padStart(2, '0');
      const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getUTCFullYear();

      const horas = fecha.getUTCHours().toString().padStart(2, '0');
      const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');

      return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    }
    function formatId(id) {
      if (id < 10) {
        return `#00${id}`;
      } else if (id >= 10 && id < 100) {
        return `#0${id}`;
      } else {
        return `#${id}`;
      }
    }

    const dataPedidos = findOrder.map((order) => ({
      id: order.id,
      code: formatId(order.id),
      fecha: formatFechaHora(order.fecha),
      estado: order.estado,
      monto_total: order.monto_total,
      detalles: order.detailsOrder.map((detail) => ({
        productoname: detail.producto.nombre,
        cantidad: detail.cantidad,
        subtotal: detail.subtotal,
        precio: detail.producto.price,
        description: detail.producto.description,
      })),
      userInfo: {
        nombre_usuario: order.user.nombre_usuario,
        correo: order.user.correo,
        nombre: order.user.nombre,
        apellido: order.user.apellido,
      },
    }));

    return res.send({
      succes: true,
      message: 'lista de pedidos enviadas con exitio',
      dataPedidos,
    });
  } catch (err) {
    return res.status(404).send(err);
  }
});
export default router;
