import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
const libsql = createClient({
  url: `${process.env.TURSO_URL}`,
  authToken: `${process.env.TURSO_TOKEN}`,
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });
const router = Router();

router.get('/getCode', (req, res) => {
  const codeProducto = (
    uuidv4().slice(0, 4) +
    '-' +
    uuidv4().slice(0, 4)
  ).toUpperCase();
  res.send({ codeProducto });
});

router.post('/addProduct', async (req, res) => {
  const data = req.body;
  try {
    const addProducto = await prisma.product.create({
      data: {
        nombre: data.name,
        code_producto: data.code,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });
    return res.send({ succes: true, message: 'Producto cargado con exito.' });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ err });
  }
});
router.get('/getProducto', async (req, res) => {
  const page = req.query.page;
  console.log(page);
  const itemsPerPage = 6;
  const skip = (page - 1) * itemsPerPage;
  const take = itemsPerPage;
  try {
    const getProduct = await prisma.product.findMany({
      skip: skip,
      take: take,
    });
    return res.send({
      succes: true,
      message: 'Enviando productos',
      productos: getProduct,
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
    const relatedCarts = await prisma.detailsCart.findMany({
      where: { codeProducto: codeDelete },
    });

    const relatedOrders = await prisma.detailsOrder.findMany({
      where: { codeProducto: codeDelete },
    });
    if (relatedCarts.length > 0) {
      await prisma.detailsCart.deleteMany({
        where: { codeProducto: codeDelete },
      });
    }

    if (relatedOrders.length > 0) {
      await prisma.detailsOrder.deleteMany({
        where: { codeProducto: codeDelete },
      });
    }

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
