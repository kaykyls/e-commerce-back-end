const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

let refreshTokens = []

const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Access denied!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "Token is invalid!" });
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

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" })
        const refreshToken = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" })

        refreshTokens.push(refreshToken)

        console.log(refreshTokens)

        res.status(200).json({ token, refreshToken, user: { id: user._id, name: user.name, email: user.email } })
    } catch(error) {

    }
})

router.post("/auth/refresh", (req, res) => {
    const { token } = req.body
    console.log(token, refreshTokens)

    if(!token) {
        return res.status(401).json({ msg: "Access denied!" })
    }

    if(!refreshTokens.includes(token)) {
        return res.status(403).json({ msg: "Invalid token!" })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ msg: "Invalid token!" })
        }

        refreshTokens = refreshTokens.filter(token => token !== token)

        const secret = process.env.SECRET
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" })
        const refreshToken = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" })

        refreshTokens.push(refreshToken)

        res.status(200).json({ token, refreshToken })
    })
})

router.post("/auth/logout", (req, res) => {
    const { token } = req.body

    refreshTokens = refreshTokens.filter(token => token !== token)

    res.status(200).json({ msg: "Logout successfully!" })
})

router.delete("/:id", checkToken, async (req, res) => {
    const id = req.params.id

    const admin = await Admin.findByIdAndDelete(id)

    if(!admin) {
        return res.status(422).json({ msg: "User not found." })
    }

    res.status(200).json({ msg: "User deleted successfully." })
})
        
module.exports = router