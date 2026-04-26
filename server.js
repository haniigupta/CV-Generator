require('dotenv').config();
const app = require('./src/app');
const coonectDB = require('./src/config/database');

coonectDB();



app.listen(3000, ()=>{
    console.log('Connected to the database successfully!');
    console.log('Server is running on port 3000');
})