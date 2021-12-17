import express from 'express';
import passport from 'passport';
import { setUserToken } from '../utils/jwt.js';

const router = express.Router();

router.post(
  '/',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const loginFailed = req.user.loginFailed;
    if (loginFailed) {
      res.render('./account/login', { loginFailed });
    } else {
      const user_id = req.user.userId;
      const name = req.user.name;
      const user = { user_id, name };
      setUserToken(res, user);
      res.redirect('/');
    }
  },
);

export default router;
