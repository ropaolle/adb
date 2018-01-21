import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Checkbox,
} from 'react-bootstrap';
import chunk from 'lodash.chunk';
import parsXlsx from './xlsx';
import './App.css';

const pageHeader = (row, completed) => (
  <div>
    <div className="page-header">
      Artdatabanken<span>{completed ? 'Komplett' : ''}</span>
    </div>
    <h3>
      <span className="klass">Klass:<i>{row.kingdom}</i></span>
      <span className="ordning">Ordning:<i>{row.order}</i></span>
      <span className="familj">Familj:<i>{row.family}</i></span>
    </h3>
  </div>);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      filename: '',
      families: [],
    };
  }

  getValidationState = () => {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  };

  handleChange = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.files);
    this.setState({ value: e.target.value });
  };


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
    console.log('FAMILIES', families);


    const cards = data => chunk(data, 3).reduce((acc, row) => {
      const r = row.map(item => (<span>{item.speices}</span>));
      console.log('speices', r);
      acc.push(<div>{r}</div>);
      return acc;
    }, []);

    const html = families.map(family => (
      <div className="page">
        {pageHeader(family.data[0], false)}
        <div>{cards(family.data)}</div>
      </div>));

    return (
      <div>
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
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Familj</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              <option value="select">select</option>
              <option value="other">...</option>
            </FormControl>
          </FormGroup>

          <FormGroup>
            <Checkbox inline>Komplettmarkering</Checkbox>
          </FormGroup>
        </Form>


        <div id="content">{html}</div>
      </div>
    );
  }
}

export default App;
