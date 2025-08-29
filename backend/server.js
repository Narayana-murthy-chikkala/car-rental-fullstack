import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app=express()

await connectDB()

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>res.send('Server is running..'))
app.use('/api/user',userRouter);
app.use('/api/owner',ownerRouter);
app.use('/api/bookings',bookingRouter);

const port=process.env.port || 3000;
app.listen(port,()=>console.log(`Server running on port ${port}`))