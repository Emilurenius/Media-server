// All external modules are loaded in:
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const fileUpload = require("express-fileupload");

const timeLog = (printData) => {
  console.log(`${new Date()} >> ${printData}`)
}

const timeWarn = (warnData) => {
  console.warn(`${new Date()} >> ${warnData}`)
}

const categories = [ // Categories supported by the server
  'ukategorisert',
  'felles-kvelder',
  'elevkveld',
  'hverdag-på-skap',
  'turer',
  'screenshots'
]

// Reading input from terminal start
const port = parseInt(process.argv[2]) || 3000
console.log(`${port} registered as server port`)
// Reading input from terminal end


app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.
app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'index')))

app.use('/static', express.static('public'))
app.use('/images', express.static('images'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index', 'index.html'))
  timeLog('Index page loaded')
})

app.get('/getUnsorted', (req,res) => {
  fs.readdir(path.join(__dirname, 'images/ukategorisert'), (err, files) => {
    // files.forEach(file => {
    //   if (file != '.gitkeep') {
    //     console.log(file)
    //     files.push(file)
    //   }
    // })
    files.shift()
    res.send(files)
  })
})

app.post('/upload', async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) { // Check if any images are recieved
    timeWarn('No images recieved')
    return res.status(400).send('No files were uploaded');
  }
  timeLog(`${Object.keys(req.files).lenght} files were uploaded`)

  for (let i=0;i<Object.keys(req.files).length;i++) { // Go through all images

    if (!categories.includes(req.body.category)) { // Check if defined category is allowed
      timeWarn('Category does not exist')
      return res.status(400).send('Category does not exist')
    }

    const existingImages = fs.readdirSync(path.join(__dirname, `/images/${req.body.category}`))
    let fileName = req.files[`file${i}`].name.split('.')

    while (existingImages.includes(`${fileName[0]}.${fileName[1]}`)) { // Check if filename exists
      fileName[0] = `${fileName[0]}_` // Add underscore if it does
    }

    await req.files[`file${i}`].mv(path.join(__dirname, `/images/${req.body.category}/${fileName[0]}.${fileName[1]}`)) // Save file
    timeLog(`${fileName[0]}.${fileName[1]} has been saved`)
  }
  timeLog('Upload successfull')
  return res.status(200).send('Images uploaded successfully')
});


app.listen(port, () => console.log(`Listening on ${port}`))