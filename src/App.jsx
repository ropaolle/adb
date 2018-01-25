import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import AppNavbar from './AppNavbar';
import Home from './pages/home/Home';
import Generator from './pages/generator/Generator';
import Images from './pages/images/Images';
import Help from './pages/help/Help';
import parsXlsx from './utils/xlsx';
import { loadImages, uploadImages } from './utils/firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { images: [], families: [] };
  }

  componentDidMount = () => {
    loadImages().then((images) => {
      this.setState({ images });
    });
  };

  loadXlsx = (file, updateState) => {
    parsXlsx(file).then((families) => {
      this.setState({ families });
      updateState(file.name, families.length);
    });
  };

  uploadImages = (files, updateState) => {
    const images = this.state.images.slice(0); // Clone images

    uploadImages(files, updateState).then((uploadedImages) => {
      uploadedImages.forEach((uploadedImage) => {
        const { name, downloadURLs } = uploadedImage.metadata;
        const imageInCache = images.find(image => image.name === name);
        // If image in cache update url, if not add image.
        if (imageInCache) {
          imageInCache.url = downloadURLs[0];
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
  };

  render() {
    const { images, families } = this.state;

    return (
      <Router>
        <div className="app">
          <AppNavbar />

          <Route exact path="/" component={Home} />
          <Route
            path="/generator"
            render={routeProps => (
              <Generator
                {...routeProps}
                images={images}
                families={families}
                loadXlsx={this.loadXlsx}
              />
            )}
          />
          <Route
            path="/images"
            render={routeProps => (
              <Images {...routeProps} images={images} uploadImages={this.uploadImages} />
            )}
          />
          <Route path="/help" component={Help} />
        </div>
      </Router>
    );
  }
}

export default App;
