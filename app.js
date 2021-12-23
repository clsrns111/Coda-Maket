/* import */
import express from 'express';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import signupRouter from './routes/signup.js';
import authRouter from './routes/auth.js';
import postRouter from './routes/posts.js';
import cartRouter from './routes/cart.js';
import homeRouter from './routes/home.js';
import conversationRouter from './routes/conversation.js';
import profileRouter from './routes/profile.js';
import messagesRouter from './routes/messages.js';
import passport from 'passport';
import passportInit from './passport/index.js';
import getUserFromJwt from './passport/middlewares/get-user-from-jwt.js';
import dotenv from 'dotenv';
import path from 'path';
import findRouter from './routes/find.js';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import { formatMessage } from './utils/messages.js';
import { getCurrentUser, userJoin, userLeave } from './utils/users.js';

passportInit();

/* setting */
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = path.resolve();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('socketio', io);
// app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/static'));
app.use('/uploads', express.static('uploads'));

app.use(passport.initialize());
app.use(getUserFromJwt);

app.use('/conversation', conversationRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/posts', postRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/find', findRouter);
app.use('/messages', messagesRouter);
app.use('/', homeRouter);
// app.use('/main', mainRouter);

//socket io 통신
io.on('connection', socket => {
  console.log('socket io 통신 ');
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join('게시물 이름');

    socket.emit(
      'message',
      formatMessage(
        'ChatBot',
        '"상대방에 대한 비방 및 욕설 시 형사적으로 처벌을 받을 수 있습니다.',
      ),
    );
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage('ChatBot', `${user.username}님이 들어왔습니다.`),
      );
  });
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage('ChatBot', `${user.username}님이 나가셨습니다.`),
      );
    }
  });

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
});

//////////////

/* server */
const start = () => {
  try {
    /* DB */
    connectDB(process.env.MONGODB);
    server.listen(process.env.PORT || 3000, () => {
      // 업로드될 파일을 저장할 폴더 생성
      const dir = './uploadedFiles';

      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      console.log(`Example app listening on port ${process.env.PORT || 3000}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
