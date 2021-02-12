const express = require('express');
const passport = require('passport');
const { cleanupUser } = require('../helpers');
const jwt = require('jsonwebtoken');
const env = require('../env');
const router = express.Router();

router.post('/signup', passport.authenticate('signup', { session: false }), (req, res) => {
    const user = cleanupUser(req.user.dataValues); 
    res.json({
        user
    });
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user) => {
        try {
            if (err || !user) {
              return res.status(401).send("Unauthorized");
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const body = { id: user.id, email: user.username };
                const token = jwt.sign({ user: body }, env.secret);
                return res.json({ token });
            });
        } catch (error) {
            return res.status(503).send({ error : "Something went wrong" });
        }
        })(req, res, next);
    }
);

module.exports = router;