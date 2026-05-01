const userModel = require('../models/user.model');

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

    // Create new user
    const newUser = new userModel({
        username,
        email,
        password
    });

    await newUser.save();

    res.status(201).json({message: 'User created successfully'});
}

module.exports = {
  registerUserController,
};