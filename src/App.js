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

// Background Particle effects options
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

// Holds state for inputs, images, bounding box for faces
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  // Calculates dimensions for bounding box
  calcFaceLocation = (data) => {
    const boxSize = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height) 
    const newArr = data.outputs[0].data.regions.map(region => {
        return{
            leftCol:region.region_info.bounding_box.left_col * width,
            topRow: region.region_info.bounding_box.top_row * height,
            rightCol:width - (region.region_info.bounding_box.right_col * width),
            bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
        } 
    })
    return newArr
  }

  // Sets state of box to calculated box
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // On input change in URL input, updates input state
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // On submit, sets imageUrl state to submitted link
  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      // Sets state of box to calculated box
      .then(response => this.displayFaceBox(this.calcFaceLocation(response)))
      .catch(err => console.log(err));
  }

  // Components to render to website
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
        <FaceRecog box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
