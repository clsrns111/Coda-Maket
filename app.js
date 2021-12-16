/* import */
import express from 'express';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import signupRouter from './routes/signup.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import passport from 'passport';
import passportInit from './passport/index.js';
import getUserFromJwt from './passport/middlewares/get-user-from-jwt.js';
import dotenv from 'dotenv';
import path from 'path';

passportInit();

/* setting */
dotenv.config();

const __dirname = path.resolve();

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));

app.use(passport.initialize());
app.use(getUserFromJwt);

app.get('/', (req, res) => res.render('./home'));
app.get('/login', (req, res) => res.render('./account/login'));
app.get('/signup', (req, res) => res.render('./account/signup'));
app.get('/post', (req, res) => res.render('./product/post'));
app.get('/detail', (req, res) => res.render('./product/detail'));

app.use('/signup', signupRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);

/* server */
const start = async () => {
  try {
    /* DB */
    await connectDB(process.env.MONGODB);
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
