const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @name registerUserController
 * @desc Register a new user, expects username, email and password
 * @access Public
 */
async function registerUserController(req, res) {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({
        $or: [{username}, {email}]
    });
    if (existingUser) {
        return res.status(400).json({message: 'User already exists'});
    }
    //hashing password
    const hash = await bcrypt.hash(password, 10);


    // Create new user
    const newUser = new userModel({
        username,
        email,
        password: hash
    });
    const token = jwt.sign(
        {id: userModel._id, username: userModel.username},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
    res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully', 
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        },
    
    }); 

    
}
/**
 * @name loginUserController
 * @desc Login a user, expects email and password
 * @access Public
 */
async function loginUserController(req, res) {
    const {email, password} = req.body;

    const user = await userModel.findOne({email});
    if (!user) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const isPsswordValid = await bcrypt.compare(password, user.password);
    if (!isPsswordValid) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
    res.cookie('token', token);

    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        token
    });
}
module.exports = {
  registerUserController,
  loginUserController
};