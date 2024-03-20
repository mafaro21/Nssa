const express = require('express');
const axios = require("axios")
const XLSX = require('xlsx');
const { consolidateExcelFiles } = require('./nssaP4.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8888;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(bodyParser.text({ limit: '100mb' }))

// Define your routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

app.post('/data', (req,res) =>{
    console.log(req.body.objects)
    const data = req.body
    consolidateExcelFiles(data)
    // const consolidateExcelFiles = consolidateExcelFiles(data)
    res.send('Data received successfully!');

})

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('data from frontend')
});

app.post('/test', (req,res) =>{
    console.log(req.body)
    res.send('recieved')
})