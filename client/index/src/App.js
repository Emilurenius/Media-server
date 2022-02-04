// Following tutorial: https://www.youtube.com/watch?v=XeiOnkEI7XI 03:23

import logo from './logo.svg';
import './App.css';

const url = (path) => {
  const origin = new URL(document.location).origin
  return `${origin}${path}`
  //return `http://172.16.2.108:3000${path}`
}

function App() {

  state = {
    selectedFile: null
  }

  const fileSelectedHandler = event => {
    console.log(event.target.files[0])
  }

  const fileUploadHandler = () => {

  }

  return (
    <div className="App">
      <input type='file' onChange={fileSelectedHandler}></input>
      <button onClick={fileUploadHandler}>Upload</button>
    </div>
  );
}

export default App;
