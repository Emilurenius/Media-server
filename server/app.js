// All external modules are loaded in:
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const fileUpload = require("express-fileupload");

const categories = [ // Categories supported by the server
  'felles-kvelder',
  'ukategorisert'
]

// Reading input from terminal start
const port = parseInt(process.argv[2]) || 3000
console.log(`${port} registered as server port`)
// Reading input from terminal end


app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.
app.use(fileUpload())

app.use('/static', express.static('public'))


app.post('/upload', function(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) { // Check if any images are recieved
    return res.status(400).send('No files were uploaded');
  }

  for (let i=0;i<Object.keys(req.files).length;i++) { // Go through all images

    if (!categories.includes(req.body[`category${i}`])) { // Check if defined category is allowed
      return res.status(400).send('Category does not exist')
    }

    const existingImages = fs.readdirSync(path.join(__dirname, `/images/${req.body[`category${i}`]}`))
    let fileName = req.files[`file${i}`].name.split('.')

    while (existingImages.includes(`${fileName[0]}.${fileName[1]}`)) { // Check if filename exists
      fileName[0] = `${fileName[0]}_` // Add underscore if it does
    }

    req.files[`file${i}`].mv(path.join(__dirname, `/images/${req.body[`category${i}`]}/${fileName[0]}.${fileName[1]}`)) // Save file
  }
  return res.status(200).send('Images uploaded successfully')
});


app.listen(port, () => console.log(`Listening on ${port}`))