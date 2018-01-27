import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import AppNavbar from './AppNavbar';
import Home from './pages/home/Home';
import Generator from './pages/generator/Generator';
import Images from './pages/images/Images';
import Help from './pages/help/Help';
import parsXlsx from './utils/xlsx';
import { loadImages, uploadImages, loadFamilies } from './utils/firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { images: [], families: [], alert: '' };
  }

  componentDidMount = () => {
    loadImages().then((images) => {
      this.setState({ images });
    });

    loadFamilies().then((families) => {
      this.setState({ families, alert: 'databasen' });
    });
  };

  loadXlsx = (file/* , updateState */) => {
    parsXlsx(file).then((families) => {
      this.setState({ families, alert: file.name });
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
    const { images, families, alert } = this.state;

    return (
      <Router>
        <div className="app">
          <AppNavbar />

          <Route
            exact
            path="/"
            render={routeProps => (
              <Home
                {...routeProps}
                images={images}
                families={families}
              />
            )}
          />

          <Route
            path="/generator"
            render={routeProps => (
              <Generator
                {...routeProps}
                images={images}
                families={families}
                loadXlsx={this.loadXlsx}
                alert={alert}
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
