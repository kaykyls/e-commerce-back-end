const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

router.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if(!name) {
        return res.status(422).send({ error: "Name is required" })
    }

    if(!email) {
        return res.status(422).send({ error: "Email is required" })
    }

    if(!password) {
        return res.status(422).send({ error: "Password is required" })
    }

    const userExists = await Admin.findOne({ email })

    if(userExists) {
        return res.status(422).send({ error: "Email already exists" })
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Admin({
        name,
        email,
        password: hashedPassword
    })

    try {
        await user.save()

        return res.status(201).send({ message: "User created successfully" })
    } catch(err) {
        return res.status(422).send({ error: "Something went wrong" })
    }
})

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email) {
        return res.status(422).send({ error: "Email is required" })
    }

    if(!password) {
        return res.status(422).send({ error: "Password is required" })
    }

    const user = await Admin.findOne({ email })

    if(!user) {
        return res.status(422).send({ error: "Invalid email or password" })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    console.log(checkPassword)

    if(!checkPassword) {
        return res.status(422).send({ error: "Invalid email or password" })
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            userId: user._id
        },
        secret)

        res.status(200).json({ msg: "Auth complete successfully", token })

    } catch(error) {

    }
})

module.exports = router