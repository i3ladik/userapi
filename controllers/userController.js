const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const register = async (req, res) => {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) return res.status(400).json({ message: 'Please provide all required fields.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            email,
            password: hashedPassword,
        });
        res.status(200).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, gender } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.gender = gender || user.gender;

        if (req.file) {
            if (user.photo) fs.unlinkSync(path.join(__dirname, '../uploads', user.photo));
            user.photo = req.file.filename;
        }

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

const getProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

const getAllProfiles = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const users = await User.findAndCountAll({
            order: [['registrationDate', 'DESC']],
            limit,
            offset
        });

        res.json({
            total: users.count,
            pages: Math.ceil(users.count / limit),
            users: users.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    getProfile,
    getAllProfiles,
};
