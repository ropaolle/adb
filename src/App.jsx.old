import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Progress } from 'reactstrap';
import parsXlsx from './utils/xlsx';
import { storage } from './utils/firebase';
import Pages from './pages/Pages';
import Dialog from './pages/Dialog';
import './App.css';

// set it up
// storage.constructor.prototype.putFiles = (filesObj) => {
//   const filesArr = [...filesObj];
//   return Promise.all(filesArr.map(file => storage.child(file.name).put(file)));
// };

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      families: [],
      selected: 'all',
      completed: true,
      uploads: [],
      status: 0,
      state: false,
    };
  }

  handleFileOpen = (e) => {
    const file = e.target.files[0];
    const filename = file.name;
    parsXlsx(file).then((families) => {
      this.setState({ families, filename });
    });
    e.target.value = '';
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

  handleSelect = (e) => {
    // TODO: Support passive event listeners https://github.com/facebook/react/issues/6436.
    this.setState({ selected: e.target.value });
  };

  handleCheckbox = (e) => {
    this.setState({ completed: e.target.checked });
  };

  render() {
    const { families, selected, completed, uploads, state } = this.state;

    const selectOptions = families.map(family =>
      <option key={family.id} value={family.id}>{family.family}</option>);

    const filteredFamilies = (selected === 'all') ? families
      : families.filter(family => family.id === selected);

    const progress = uploads.map(file => (
      <Progress striped color="success" value={file.progress} key={file.key}>
        {file.name} {file.progress}%
      </Progress>));

    return (
      <div className="page-wrapper">
        <div className="header">
          <h1>Artdatabanken sidgenerator</h1>
          <div className="help-link">
            <a href="lib/Howto.htm">Beskär bilder med Fotor</a>
          </div>

          {progress}

          <Dialog state={state} />

          <Form inline className="settings">
            <FormGroup>
              <label className="btn btn-primary btn-file" htmlFor="fileInput">
              Öppna Excelfil
                <input type="file" onChange={this.handleFileOpen} id="fileInput" />
              </label>
            </FormGroup>

            <FormGroup>
              <Label for="speicesSelect" >Familj</Label>
              <Input type="select" name="select" id="speicesSelect" onChange={this.handleSelect}>
                <option value="all">alla</option>
                {selectOptions}
              </Input>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={completed} onChange={this.handleCheckbox} />{' '}
              Komplettmarkering
              </Label>
            </FormGroup>

            <FormGroup className="file-upload">
              <label className="btn btn-success btn-file" htmlFor="fileUpload">
                Ladda upp bilder
                <input type="file" onChange={this.handleFileUpload} id="fileUpload" multiple />
              </label>
            </FormGroup>

          </Form>
        </div>

        {families && <Pages families={filteredFamilies} completed={completed} />}
      </div>
    );
  }
}

export default App;
