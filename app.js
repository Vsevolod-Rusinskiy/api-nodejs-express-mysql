require("dotenv").config();
const express = require('express');
const app = express();
const mysql = require('mysql')

app.use(express.static(__dirname + '/public'));



app.get('/api', (req, res) => {
    res.json({
        success: 1,
        message: 'hi'
    })
});

// const server = http.createServer(app)

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'users_testing_task'

})

con.connect(err => {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log('MySQL is connected...');
    }
})

app.listen(process.env.APP_PORT, (req, res) => {
    console.log(`Server is working on port ${process.env.APP_PORT}`);
});