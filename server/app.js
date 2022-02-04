// All external modules are loaded in:
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const fileUpload = require("express-fileupload");

const categories = [
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

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded');
  }

  for (let i=0;i<Object.keys(req.files).length;i++) {
    if (!categories.includes(req.body[`category${i}`])) {
      return res.status(400).send('Category does not exist')
    }

    const existingImages = fs.readdirSync(path.join(__dirname, `/images/${req.body[`category${i}`]}`))
    let fileName = req.files[`file${i}`].name.split('.')

    while (existingImages.includes(`${fileName[0]}.${fileName[1]}`)) {
      fileName[0] = `${fileName[0]}_`
    }

    req.files[`file${i}`].mv(path.join(__dirname, `/images/${req.body[`category${i}`]}/${fileName[0]}.${fileName[1]}`))
  }
  return res.status(200).send('Images uploaded successfully')
});


app.listen(port, () => console.log(`Listening on ${port}`))