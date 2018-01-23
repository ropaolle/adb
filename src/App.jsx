import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import parsXlsx from './utils/xlsx';
import Pages from './pages/Pages';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      families: [],
      selected: 'all',
      completed: true,
    };
  }

  handleSelect = (e) => {
    // TODO: Support passive event listeners https://github.com/facebook/react/issues/6436.
    this.setState({ selected: e.target.value });
  };

  handleCheckbox = (e) => {
    this.setState({ completed: e.target.checked });
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
    const { families, selected, completed } = this.state;

    const selectOptions = families.map(family =>
      <option key={family.id} value={family.id}>{family.family}</option>);

    const filteredFamilies = (selected === 'all') ? families
      : families.filter(family => family.id === selected);

    return (
      <div className="page-wrapper">
        <div className="header">
          <h1>Artdatabanken sidgenerator</h1>
          <div className="help-link">
            <a href="lib/Howto.htm">Beskär bilder med Fotor</a>
          </div>

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
          </Form>
        </div>

        {families && <Pages families={filteredFamilies} completed={completed} />}
      </div>
    );
  }
}

export default App;
