import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

/*
//////--REFERENCIA DE formData--//////
email: String,
username: String,
name: String,
surname: String,
password: String,
confirPassword: String,
*/

router.post('/login', async (req, res) => {
  const cart = await prisma.cart.findMany();
  console.log(cart);
  const formData = req.body;
  const passwordBcrypt = await bcrypt.hash(
    formData.password,
    parseInt(process.env.HASH)
  );
  try {
    const existingUser = await prisma.user.findUnique({
      where: { nombre_usuario: formData.username },
    });
    if (!existingUser) {
      throw new Error('NonExistingUser');
    }

    bcrypt.compare(
      formData.password,
      existingUser.contrasena,
      (err, result) => {
        if (result) {
          const dataToken = {
            id: existingUser.id,
            username: existingUser.nombre_usuario,
            correo: existingUser.correo,
            rol: existingUser.rol,
          };

          const token = jwt.sign(dataToken, process.env.SECRET_KEY, {
            expiresIn: '2h',
          });
          res
            .cookie('loggedToken', token, {
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            })
            .send({ succes: 'true', message: 'La contraseña es correcta' });
        } else {
          return res.status(400).send({
            error: 'PasswordIncorrect',
            message: 'La contraseña es incorrecta.',
          });
        }
      }
    );
  } catch (error) {
    if (error == 'Error: NonExistingUser') {
      return res.status(400).send({
        error: 'NonExistingUser',
        message: 'No hay una cuenta registrada con ese nombre de usuario',
      });
    } else {
      return res.status(400).send({ error });
    }
  }
});
router.post('/register', async (req, res) => {
  const formData = req.body;
  const passwordBcrypt = await bcrypt.hash(
    formData.password,
    parseInt(process.env.HASH)
  );

  try {
    const existingUserOrEmail = await prisma.user.findFirst({
      where: {
        OR: [{ nombre_usuario: formData.username }, { correo: formData.email }],
      },
    });

    if (existingUserOrEmail) {
      if (
        existingUserOrEmail.nombre_usuario === formData.username &&
        existingUserOrEmail.correo === formData.email
      ) {
        throw new Error('ExistingUserAndEmail');
      } else if (existingUserOrEmail.nombre_usuario === formData.username) {
        throw new Error('ExistingUser');
      } else if (existingUserOrEmail.correo === formData.email) {
        throw new Error('ExistingEmail');
      }
    }

    const createAccount = await prisma.user.create({
      data: {
        nombre_usuario: formData.username,
        correo: formData.email,
        nombre: formData.name,
        apellido: formData.surname,
        contrasena: passwordBcrypt,
      },
    });
    const dataToken = {
      id: createAccount.id,
      username: createAccount.nombre_usuario,
      correo: createAccount.correo,
      rol: createAccount.rol,
    };

    const token = jwt.sign(dataToken, process.env.SECRET_KEY, {
      expiresIn: '2h',
    });
    const createCart = await prisma.cart.create({
      data: { id_user: createAccount.id },
    });
    res
      .cookie('loggedToken', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
      .send({ sucees: 'Cuenta creada exitosamente.' });
  } catch (error) {
    if (error == 'Error: ExistingEmail') {
      return res.status(400).send({
        error: 'ExistingEmail',
        message: 'Ya hay una cuenta registrada con ese correo',
      });
    } else if (error == 'Error: ExistingUser') {
      return res.status(400).send({
        error: 'ExistingUser',
        message: 'Ya hay un usuario registrado con este nombre',
      });
    } else if (error == 'Error: ExistingUserAndEmail') {
      return res.status(400).send({
        error: 'ExistingUserAndEmail',
        message: 'Ya hay una cuenta registrada con ese usuario y correo',
      });
    } else {
      return res.status(400).send({ error });
    }
  }
});
export default router;
