import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Progress, Container, Row, Col, Alert } from 'reactstrap';
import { database, storage } from '../../utils/firebase';

function uploadImages(fileArr, updateState) {
  return Promise.all(
    fileArr.map((file, i) => {
      const uploadTask = storage.child(`images/${file.name}`).put(file);
      uploadTask.on(
        'state_changed',
        (/* snapshot */) => {},
        (error) => {
          console.log('Image upload error', error);
        },
        () => {
          // Save downloadURL in database
          const { downloadURL, metadata } = uploadTask.snapshot;
          database
            .collection('images')
            .doc(metadata.name)
            .set({ downloadURL });
          // Update page state
          updateState(i, downloadURL);
        },
      );
      return uploadTask;
    }),
  );
}

class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: [],
      images: props.images,
      showImages: false,
      alert: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ images: props.images });
  }

  updateState = (i, downloadURL) => {
    const { status } = this.state;
    status[i].uploaded = true;
    status[i].url = downloadURL;
    this.setState({ status });
  };

  handleFileUpload = (e) => {
    const files = e.target.files; // console.log(files);
    const fileArr = [...files];
    const status = fileArr.map((file, i) => ({ name: file.name, uploaded: false, key: i }));
    this.setState({ status });
    uploadImages(fileArr, this.updateState)
      .then((/* metadatas */) => {
        // All files uploaded
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  handleShowImages = () => {
    this.setState({ showImages: !this.state.showImages });
  };

  render() {
    const { status, alert, images, showImages } = this.state;

    const progress = () => {
      const currProg = status.filter(val => val.uploaded === true).length / status.length * 100;
      return (
        !!status.length && (
          <Progress striped color="success" value={currProg}>
            {currProg}%
          </Progress>
        )
      );
    };

    const imageList = imgs =>
      imgs.filter(file => file.url !== undefined).map(file => (
        <Col className="col-4 col-md-3" key={file.name}>
          <div>
            <img className="thumbnail" src={file.url} alt={file.name} />
          </div>
          <div>{file.name}</div>
        </Col>
      ));

    return (
      <Container fluid className="page-content">
        <div className="progress-wrapper">{progress()}</div>

        {alert && <Alert color="info">This is a info alert — check it out!</Alert>}

        <Row>
          <Col className="col-6">
            <h1>Bilder</h1>
          </Col>
          <Col className="col-6">
            <label className="btn btn-success btn-file-upload" htmlFor="fileUpload">
              Ladda upp bilder
              <input type="file" onChange={this.handleFileUpload} id="fileUpload" multiple />
            </label>
            <Button
              onClick={this.handleShowImages}
              className="show-images"
              color="primary"
            >
              {showImages ? 'Dölj bilder' : 'Visa alla bilder'}
            </Button>
          </Col>
        </Row>

        <Row>{imageList(status)}</Row>

        {showImages && <Row><Col><h2>Alla uppladdade bilder</h2></Col></Row>}
        <Row>{showImages && imageList(images)}</Row>
      </Container>
    );
  }
}

Images.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Images;
