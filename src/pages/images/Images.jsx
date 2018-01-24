import React, { Component } from 'react';
import { Form, FormGroup, Progress, Container, Row, Col } from 'reactstrap';
import { storage } from '../../utils/firebase';

storage.constructor.prototype.putFiles = (filesObj) => {
  const filesArr = [...filesObj];
  return Promise.all(filesArr.map((file) => {
    const uploadTask = storage.child(file.name).put(file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`${file.name} ${progress}%`);
    });
    return uploadTask;
  }));
};

class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploads: [],
    };
  }

  handleFileUpload = (e) => {
    const files = e.target.files;
    console.log(files);

    const filesArr = [...files];
    const uploads = filesArr.map((file, i) => ({ name: file.name, progress: 0, key: i }));
    this.setState({ uploads });

    const upload = Promise.all(filesArr.map((file, i) => {
      const uploadTask = storage.child(file.name).put(file);
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploads[i].progress = progress;
        this.setState({ uploads });
      });
      return uploadTask;
    }));

    // use it!
    upload.then((metadatas) => {
      console.log('metadata', metadatas);
    }).catch((error) => {
      console.log('erroe', error);
    });
  }

  render() {
    const { uploads } = this.state;

    const progress = uploads.map(file => (
      <Progress striped color="success" value={file.progress} key={file.key}>
        {file.name} {file.progress}%
      </Progress>));

    return (
      <Container fluid classname="page-content">
        <Row>
          <Col md="6"><h1>Bilder</h1></Col>
          <Col md="6">
            <Form>
              <FormGroup className="file-upload">
                <label className="btn btn-success btn-file" htmlFor="fileUpload">
                Ladda upp bilder
                  <input type="file" onChange={this.handleFileUpload} id="fileUpload" multiple />
                </label>
              </FormGroup>
            </Form>
          </Col>
        </Row>

        {progress}
      </Container>
    );
  }
}

export default Images;
