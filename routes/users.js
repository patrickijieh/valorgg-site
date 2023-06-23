const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcrypt = require('bcrypt');

const apikey = process.env.API_KEY_URL;
// !!! GET BYCRPT FOR PASSWORD HASHING !!!

router.get('/user-list/', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/from-user/:username', getUser, async (req, res) => {
    try {
        const thisUser = {
            username: res.person.username,
            valorantAccounts: res.person.valorantAccounts
        };
        res.status(200).json(thisUser);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/from-login/:username/:password', async (req, res) => {
    try {
        const dbUser = await user.findOne({ username: req.params.username });

        if (dbUser == null) {
            res.status(404).json({ message: "User not found!" });
            return;
        }

        const match = await bcrypt.compare(req.params.password, dbUser.password);

        if (match) {
          const thisUser = {
            username: dbUser.username,
            valorantAccounts: dbUser.valorantAccounts
          };
            res.status(200).json(thisUser);
        }

        else {
            res.status(404).json({ message: "User not found!" });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/from-login/', async (req, res) => {
    const dbUser = await user.findOne({ username: req.body.username });

    if (dbUser != null) {
        res.status(400).json({ message: "Username is already taken!" });
        return;
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const newUser = new user({
        username: req.body.username,
        password: req.body.password
    })

    try {
        const person = await newUser.save();
        res.status(201).json(person);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/from-user/:username', getUser, async (req, res) => {
    if (req.body.username != null) {
        res.person.username = req.body.username;
    }

    if (req.body.password != null) {
        const hashedPassword = await hashPassword(req.body.password);
        res.person.password = hashedPassword;
    }

    if (req.body.valorantAccounts != null) {
        res.person.valorantAccounts = req.body.valorantAccounts;
    }

    try {
        const updatedUser = await res.person.save();
        res.status(200).json(updatedUser);

    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/from-user/:username', getUser, async (req, res) => {
    try {
        await res.person.deleteOne();
        res.status(204).json({ message: "User deleted!" });

    } catch (err) {
        res.status(500).json({ message: res.person });
    }
});

async function hashPassword(pword) {
    const hash = await bcrypt.hash(pword, 10);
    return hash;
}

async function getUser(req, res, next)
{
    try {
        const thisPerson = await user.findOne({ username: req.params.username });

        if (thisPerson == null) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.person = thisPerson;
        next();

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = router;