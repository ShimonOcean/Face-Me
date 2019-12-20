import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      route: 'signin',
      isSignedIn: false
    }
  }

  // Calculates dimensions of bounding box
  calcFaceLocation = (data) => {
    const clarifaiFace = (data.outputs[0].data.regions[0].region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
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

  // Sets state for isSignedIn to determine which page to display
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  // Components to render to website
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesSelect}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
        ? <div> 
          <Logo />
          <Rank />
          <ImgLinkForm 
              onInputChange={this.onInputChange} 
              onSubmit={this.onSubmit}
            />
            <FaceRecog box={box} imageUrl={imageUrl}/>
          </div> 
        : (
          route === 'signin' 
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  }
}

export default App;
