import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react'
import axios from 'axios'

const url = (path) => {
  const origin = new URL(document.location).origin
  //return `${origin}${path}`
  return `http://172.16.2.108:3000${path}`
}

function App() {

  const getTest = () => {
    axios.get(`${url('/getUnsorted')}`)
      .then((response) => {
        console.log(response.data)
      })
      .catch(error => console.warn(error))
  }

  return (
    <div className="App">
      <button onClick={getTest}>Test</button>
      <img src={url('/images/ukategorisert/IMG_20210804_184914__01.jpg')} style={{size: '20%'}}></img>
    </div>
  );
}

export default App;
