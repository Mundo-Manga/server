import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import verifyRoutes from './src/routes/verify.routes.js';
import productRoutes from './src/routes/product.routes.js';
import usersRoutes from './src/routes/user.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import orderRoutes from './src/routes/order.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://ecomerce-olimpiadas.web.app',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));


app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(3000, () => {
  console.log('Server on port', 3000);
});
