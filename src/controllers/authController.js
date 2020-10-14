const { Router } = require('express');

const router = Router();
const User = require('../models/users');

const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');

router.post('/signin', async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(404).send("The email doesn't exist");
    }
    const passIsValid = await user.validatePass(password);
    if( !passIsValid ) {
        return res.send(401).json({auth: false, token: null});
    }
    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    });
    res.json({auth: true, token});
});

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User({
        username: username,
        email: email,
        password: password
    });
    user.password = await user.encryptPass(user.password);
    user.save();
    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    });
    res.json({auht: true, token});
});

router.get('/me', verifyToken, async (req, res, next) => {
    const user = await User.findById(req.userId.id, { password: 0});
    if (!user) {
        return res.status(404).send('Not user found');
    }
    res.json(user);
});

module.exports = router;