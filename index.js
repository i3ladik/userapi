const express = require('express');
const userRoutes = require('./routes/userRoutes.js');
const sequelize = require('./dbconfig.js');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('', userRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
}).catch(err => console.log('Error connecting to the database:', err));
