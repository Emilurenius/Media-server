// Following tutorial: https://www.youtube.com/watch?v=XeiOnkEI7XI 03:23

import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react'
import axios from 'axios'

const url = (path) => {
  const origin = new URL(document.location).origin
  //return `${origin}${path}`
  return `http://172.16.2.108:3000${path}`
}

const App = () => {

  const [selectedFiles, setSelectedFiles] = useState([])
  const [filesAmount, setFilesAmount] = useState(`0 Filer valgt`)
  const [category, setCategory] = useState('ukategorisert')
  const [progress, setProgress] = useState('')
  const [fileInput, setFileInput] = useState(null)

  const fileSelectedHandler = event => {
    setSelectedFiles(event.target.files)
    setFilesAmount(`${event.target.files.length} Filer valgt`)
  }

  const categoryChangeHandler = event => {
    setCategory(event.target.value)
  }

  const fileUploadHandler = () => {
    const fd = new FormData()
    fd.append('category', category)
    for (let i=0;i<selectedFiles.length;i++) {
      fd.append(`file${i}`, selectedFiles[i], selectedFiles[i].name)
    }
    axios.post(url('/upload'), fd, {
      onUploadProgress: progressEvent => {
        setProgress(`Laster opp: ${Math.round(progressEvent.loaded / progressEvent.total * 100)}%`)
      }
    })
      .then(res => {
        console.log(res)
        setProgress('Opplasting ferdig')
      })
      .catch(err => {
        console.log(err)
        setProgress('Oida! Noe gikk galt. Hvis problemet fortsetter, si ifra i skap chatten!')
      })
  }

  return (
    <div className="App">
      <p className='header'>Legg inn bilder til Årbok!</p>
      <div className="selectContainer">
        <select name='kategori' onChange={categoryChangeHandler}>
          <option value='ukategorisert'>Ukategorisert</option>
          <option value='felles-kvelder'>Felles kvelder</option>
        </select>
      </div>
      <div><input type='file' onChange={fileSelectedHandler} multiple style={{display: 'none'}} ref={fileInput_ => setFileInput(fileInput_)} ></input></div>
      <div><button onClick={() => fileInput.click()} >Velg filer</button></div>
      <div><p>{filesAmount}</p></div>
      <div><button onClick={fileUploadHandler}>Send inn</button></div>
      <div className='percentageReadout'><p>{progress}</p></div>
    </div>
  );
}

export default App;
