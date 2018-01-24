import React, { Component } from 'react';
import { Button, Progress, Container, Row, Col, Alert } from 'reactstrap';
import { database, storage } from '../../utils/firebase';

/* TODO
- Ladda upp filer och lagra länk i db.
-

*/

function uploadImages(fileArr, updateState) {
  return Promise.all(fileArr.map((file, i) => {
    const uploadTask = storage.child(`images/${file.name}`).put(file);
    uploadTask.on('state_changed', (/* snapshot */) => {
    }, (error) => {
      console.log('Image upload error', error);
    }, () => {
      // Save downloadURL in database
      const { downloadURL, metadata } = uploadTask.snapshot;
      database.collection('images').doc(metadata.name).set({ downloadURL });
      // Update page state
      updateState(i, downloadURL);
    });
    return uploadTask;
  }));
}

class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [],
      images: [],
      alert: '',
    };
  }

  updateState = (i, downloadURL) => {
    const { status } = this.state;
    status[i].uploaded = true;
    status[i].url = downloadURL;
    this.setState({ status });
  }

  handleFileUpload = (e) => {
    const files = e.target.files; // console.log(files);
    const fileArr = [...files];
    const status = fileArr.map((file, i) => ({ name: file.name, uploaded: false, key: i }));
    this.setState({ status });
    uploadImages(fileArr, this.updateState).then((/* metadatas */) => {
      // All files uploaded
    }).catch((error) => {
      console.log('error', error);
    });
  }

  render() {
    const { status, alert /* , images */ } = this.state;

    const progress = () => {
      const currProg = (status.filter(val => val.uploaded === true).length / status.length) * 100;
      return (!!status.length && <Progress striped color="success" value={currProg}>
        {currProg}%</Progress>);
    };

    const imageList = status.filter(file => file.url !== undefined).map(file => (
      <Col className="col-4 col-md-3" key={file.key}>
        <div><img className="thumbnail" src={file.url} alt={file.name} /></div>
        <div>{file.name}</div>
      </Col>));
    // console.log('status', status);

    return (
      <Container fluid className="page-content">
        <div className="progress-wrapper">{progress()}</div>

        {alert && <Alert color="info">This is a info alert — check it out!</Alert>}

        <Row>
          <Col className="col-6"><h1>Bilder</h1></Col>
          <Col className="col-6">
            <label className="btn btn-success btn-file-upload" htmlFor="fileUpload">
                Ladda upp bilder
              <input type="file" onChange={this.handleFileUpload} id="fileUpload" multiple />
            </label>
            <Button className="show-images" color="primary">Visa alla bilder</Button>{' '}
          </Col>
        </Row>

        <Row>{imageList}</Row>
      </Container>
    );
  }
}

export default Images;
