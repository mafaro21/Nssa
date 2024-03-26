const express = require('express');
const axios = require("axios")
const XLSX = require('xlsx');
const { consolidateExcelFiles } = require('./nssaP4.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8888;
const fs = require('fs');
const multer = require('multer');
const path = require('path')

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.text({ limit: '100mb' }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Define your routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.get('/', (req, res) => {
    console.log(req.body)
    console.log(req.body.length)
    // const data = req.body
    // consolidateExcelFiles(data)
    // const consolidateExcelFiles = consolidateExcelFiles(data)
    res.send('Data received successfully!');

})

app.post('/test', (req, res) => {
    console.log(req.body)
    console.log(req.body.length)
    res.send('recieved')

    let data = '';

    // Handle incoming data chunks
    req.on('data', chunk => {
        data += chunk;
    });

    // Handle end of data stream
    req.on('end', () => {
        const fileName = req.headers['x-filename'] || 'uploaded_file.txt';

        // Write data to a file
        fs.writeFile(fileName, data, err => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Error writing file');
            } else {
                console.log('File saved successfully:', fileName);
                // res.send('File uploaded successfully');
            }
        });
    });
})

app.post('/upload', upload.array('file'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    // console.log(req.files[0])

    const sourceFile = req.files[1].path
    const destinationFile = req.files[0].path

    consolidateExcelFiles(sourceFile, destinationFile, res)

    // console.log(sourceFile + '\n' + destinationFile)

    // Loop through each uploaded file
    req.files.forEach(file => {
        // File details
        const fileName = file.originalname;
        const filePath = file.path;

        // Read the uploaded file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading the file.');
            }

        });
    });
});

app.get('/consolidated', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, './', 'Consolidated.xlsx'); // Adjust path to your file directory

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            return res.status(500).send('Error downloading file');
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully:', filePath);
            }
        });
    });
});

app.get('/non-reg', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, './', 'Not-Registered.xlsx'); // Adjust path to your file directory

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            return res.status(500).send('Error downloading file');
        }
    });
});
app.get('/termi', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, './', 'Terminated.xlsx'); // Adjust path to your file directory

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            return res.status(500).send('Error downloading file');
        }
    });
});
