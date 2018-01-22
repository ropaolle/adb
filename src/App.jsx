import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import parsXlsx from './xlsx';
import Pages from './Pages';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      families: [],
    };
  }

  // handleChange = (e) => {
  //   this.setState({ value: e.target.value });
  // };

  handleFileOpen = (e) => {
    const file = e.target.files[0];
    const filename = file.name;
    parsXlsx(file).then((families) => {
      this.setState({ families, filename });
    });
    e.target.value = '';
  }

  render() {
    const { families } = this.state;

    return (
      <div>
        <div className="header">
          <h1>Artdatabanken</h1>
          <div className="help-link">
            <a href="lib/Howto.htm">Beskär bilder med Fotor</a>
          </div>

          <Form inline>
            <FormGroup>
              <label className="btn btn-primary btn-file" htmlFor="fileInput">
              Öppna Excelfil
                <input type="file" onChange={this.handleFileOpen} id="fileInput" />
              </label>
            </FormGroup>
            <FormGroup controlid="formControlsSelect">
              <Label>Familj</Label>
              <Input type="select" name="select" id="exampleSelect">
                <option value="select">select</option>
                <option value="other">...</option>
              </Input>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input type="checkbox" />{' '}
              Komplettmarkering
              </Label>
            </FormGroup>
          </Form>
        </div>

        {families && <Pages families={families} />}
      </div>
    );
  }
}

export default App;
