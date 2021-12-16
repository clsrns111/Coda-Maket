import express from 'express';
import passport from 'passport';
import { setUserToken } from '../utils/jwt.js';

const router = express.Router();

router.post(
  '/',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.redirect('/');
  },
);

export default router;
