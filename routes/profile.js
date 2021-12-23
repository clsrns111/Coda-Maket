import express from 'express';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Post from '../models/Post.js';
import store from '../passport/middlewares/multer.js';
import hashingPassword from '../utils/hash-password.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { postId } = req.query;
  const loginedUser = await User.findOne({ shortId: req.user.id });

  if (postId === undefined) {
    res.render('./profile', { user: loginedUser, isOwner: true });
  } else {
    const post = await Post.findOne({ shortId: postId }).populate('author');
    const postedUser = await User.findOne({ shortId: post.author.shortId });
    if (postedUser === loginedUser) {
      const user = await User.findOne({ shortId: req.user.id });
      res.render('./profile', { user: postedUser, isOwner: true });
    } else {
      res.render('./profile', { user: postedUser, isOwner: false });
    }
  }
});

router.get('/edit', async (req, res) => {
  const user = await User.findOne({ shortId: req.user.id });
  res.render('./profile-edit', { user });
});

router.post('/password-check', async (req, res) => {
  const user = await User.findOne({ name: req.user.name });

  console.log(user.password === hashingPassword(req.body.password));

  if (user.password === hashingPassword(req.body.password)) {
    res.redirect('/profile/edit');
  } else {
    res.redirect('/profile');
  }
});

router.post('/edit', store.single('image'), async (req, res) => {
  const { name, pwd, location } = req.body;

  const thumbnail = req.file ? req.file.path.replace(/\\/g, '/') : '';
  const password = hashingPassword(pwd);
  await User.findOneAndUpdate(
    { shortId: req.user.id },
    {
      name,
      password,
      location,
      thumbnail,
    },
  );

  res.redirect('/profile');
});

router.get('/tranactions', async (req, res) => {
  const user = await User.findOne({ shortId: req.user.id });
  const posts = await Post.find({ author: user });
  res.json({ list: posts });
});

router.get('/purchases', async (req, res) => {
  const user = await User.findOne({ shortId: req.user.id });
  const posts = await Post.find({ purchased_user: user });
  res.json({ list: posts });
});

router.get('/carts', async (req, res) => {
  const user = await User.findOne({ shortId: req.user.id });
  const cart = await Cart.find({ user }).populate('post');
  const list =  cart.map(item => item.post);
  res.json({ list });
});

export default router;
