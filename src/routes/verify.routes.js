import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

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
