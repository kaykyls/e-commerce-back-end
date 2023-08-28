const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
}

router.get("/:id", checkToken, async (req, res) => {
    const id = req.params.id

    const admin = await Admin.findById(id, "-password");

    if (!admin) {
        return res.status(422).json({ msg: "User not found." });
    }

    res.status(200).json({ admin });
})

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
        secret,
        { expiresIn: "1h" }
        )

        res.status(200).json({ msg: "Auth complete successfully", token })

    } catch(error) {

    }
})

router.post("/auth/refresh", (req, res) => {
    const token = req.body.token

    if(!token) {
        return res.status(401).json({ msg: "Access denied!" })
    }
})
        
module.exports = router