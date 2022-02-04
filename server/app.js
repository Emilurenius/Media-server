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

  else if (!categories.includes(req.body.category)) {
    return res.status(400).send('Category does not exist')
  }

  const existingImages = fs.readdirSync(path.join(__dirname, `/images/${req.body.category}`))
  let fileName = req.files.sampleFile.name.split('.')
  while (existingImages.includes(`${fileName[0]}.${fileName[1]}`)) {
    fileName[0] = `${fileName[0]}_`
  }

  req.files.sampleFile.mv(path.join(__dirname, `/images/${req.body.category}/${fileName[0]}.${fileName[1]}`))
  return res.status(200).send('Image uploaded successfully')
});


app.listen(port, () => console.log(`Listening on ${port}`))