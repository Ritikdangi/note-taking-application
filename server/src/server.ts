import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes'
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const limiter = rateLimit({
//     windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
//     max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
//     message: 'Too many requests, please try again later.',
//   });

app.use(helmet());
// app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);


// handle  invalid routes (no path to avoid Express 5 path-to-regexp issues)
app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Route ${req.originalUrl} not found`
    });
  });


 async function connectDb(): Promise<void> 
{
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectDb();


app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(' Error:', error);
    
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  });

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
