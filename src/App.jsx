import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import AppNavbar from './AppNavbar';
import Home from './pages/home/Home';
import Generator from './pages/generator/Generator';
import Images from './pages/images/Images';
import Help from './pages/help/Help';
import { loadImages, uploadImages } from './utils/firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { images: [] };
  }

  componentDidMount = () => {
    loadImages().then((images) => {
      this.setState({ images });
    });
  }

  uploadImages = (files, updateStatus) => {
    const images = this.state.images.slice(0); // Clone images

    uploadImages(files, updateStatus).then((uploadedImages) => {
      uploadedImages.forEach((uploadedImage) => {
        const { name, downloadURLs } = uploadedImage.metadata;
        const foundImage = images.find(image => image.name === name);
        if (foundImage) {
          foundImage.url = downloadURLs[0];
        } else {
          images.push({
            name,
            url: downloadURLs[0],
            uploaded: true,
          });
        }
        this.setState({ images });
      });
    });
  }

  render() {
    return (<Router>
      <div className="app">
        <AppNavbar />

        <Route exact path="/" component={Home} />
        <Route path="/generator" component={Generator} />
        <Route
          path="/images"
          render={routeProps =>
            <Images {...routeProps} images={this.state.images} uploadImages={this.uploadImages} />}
        />
        <Route path="/help" component={Help} />
      </div>
    </Router>);
  }
}

export default App;
