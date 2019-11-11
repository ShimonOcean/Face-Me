import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImgLinkForm from './components/ImgLinkForm/ImgLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecog from './components/FaceRecog/FaceRecog';
import './App.css';
import 'tachyons';

const app = new Clarifai.App({
  apiKey: 'a5e8e4db3f9c430ca66fbf19886ecf20'
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      "https://samples.clarifai.com/metro-north.jpg")
      .then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
  
      }
    );

  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesSelect}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImgLinkForm 
          onInputChange={this.onInputChange} 
          onSubmit={this.onSubmit}/>
        <FaceRecog imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
