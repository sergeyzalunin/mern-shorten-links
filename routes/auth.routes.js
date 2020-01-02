const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Minimum lenght of password must be 6')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong registration data'
            })
        }

        
        const {email, password} = req.Body
        const candidate = await User.findOne({ email })

        if (candidate) {
            res.status(400).json({ message: 'Such user already exists'})
        }

        const hashedPassword = bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })
        await user.save()

        res.status(201).json({ message: 'User is created'})

    } catch (e) {
        res.status(500).json({message: 'Somthing went wrong, try again'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', `Password hasn't to be emty`).exists()
    ],
    async (reg, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong enter data'
            })
        }

        const {email, password} = req.Body

        const user = await User.findOne({ email })

        if (!user){ 
            return res.status(400).json({ message: `User isn't found`})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400)
                .json({ message: 'You has entered the wrong password'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        )

        res.json({ token, userId: user.id })

    } catch (e) {
        res.status(500).json({message: 'Somthing went wrong, try again'})
    }
})

module.exports = router