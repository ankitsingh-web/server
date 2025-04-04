//const express=require('express');
import express from 'express'

const app=express();
import morgan from 'morgan';
//const cors=require('cors');
import cors from 'cors'
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.route.js'
import paymentRoutes from './routes/payment.routes.js'
import miscRoutes from './routes/miscellenious.routes.js'
//const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.middleware.js';
app.use(express.json());
app.use(express.urlencoded({extended:true}));//that help to find data from qeuery param and parsing the data;
//console.log(process.env.FRONTEND_URL);
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from this origin
  credentials: true,                // Allow credentials such as cookies
}));



app.use(morgan('dev'))
app.use(cookieParser());


app.use('/api/v1/user',userRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/payments',paymentRoutes);
app.use('/api/v1', miscRoutes);

app.all('*',(req,res)=>{res.status(400).send("OOPS! page not found")})
app.use(errorMiddleware)
// module.exports=app;
export default app;