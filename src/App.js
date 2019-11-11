import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImgLinkForm from './components/ImgLinkForm/ImgLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons';

const particlesSelect = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

function App() {
  return (
    <div className="App">
      <Particles className='particles'
        params={particlesSelect}
      />
      <Navigation />
      <Logo />
      <Rank />
      <ImgLinkForm />
      {/* {

      <FaceRecog/>} */}
    </div>
  );
}

export default App;
