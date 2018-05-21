const express = require('express');
const mongoose = require('mongoose');
const ApiRout = require('./routes/api');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://testuser:123test@ds129670.mlab.com:29670/testdata')
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...'+err);
    process.exit();
});


app.get('/', (req, res) => {
    res.json({"message": "Welcome to api, use /api for api managment "});
});
app.use('/api',ApiRout);
app.listen(port, () => {
    console.log("Server is listening on port "+port);
});