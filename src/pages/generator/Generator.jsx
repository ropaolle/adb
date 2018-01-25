import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Container, Col, Row, Alert } from 'reactstrap';
import Pages from './Pages';

class PageGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      completed: true,
      alert: '',
    };
  }

  updateState = (filename, length) => {
    const alert = <span><b>{filename}</b> laddad. <b>{length}</b> familjer hittade.</span>;
    this.setState({ alert });
  };

  handleFileOpen = (e) => {
    const file = e.target.files[0];
    this.props.loadXlsx(file, this.updateState);
  }

  handleSelect = (e) => {
    // TODO: Support passive event listeners https://github.com/facebook/react/issues/6436.
    this.setState({ selected: e.target.value });
  };

  handleCheckbox = (e) => {
    this.setState({ completed: e.target.checked });
  };

  render() {
    const { selected, completed, alert } = this.state;
    const { images, families } = this.props;

    const selectOptions = families.map(family =>
      <option key={family.id} value={family.id}>{family.family}</option>);

    const filteredFamilies = (selected === 'all') ? families
      : families.filter(family => family.id === selected);

    return (
      <div>
        <Container fluid className="page-content generator-page">
          <Alert color="success">
            {alert}
          </Alert>

          <Row>
            <Col><h1>Sidgenerator</h1></Col>
            <Col>
              <label className="btn btn-primary float-right" htmlFor="fileInput">
              Ladda Excelfil
                <input type="file" onChange={this.handleFileOpen} id="fileInput" />
              </label>
            </Col>
          </Row>

          <Form inline className="settings">
            <FormGroup>
              <Label for="speicesSelect" >Familj</Label>
              <Input type="select" name="select" id="speicesSelect" onChange={this.handleSelect}>
                <option value="">Välj familj...</option>
                {selectOptions}
                <option value="all">Alla</option>
              </Input>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={completed} onChange={this.handleCheckbox} />{' '}
              Komplettmarkering
              </Label>
            </FormGroup>
          </Form>

        </Container>

        {families && <Pages families={filteredFamilies} completed={completed} images={images} />}
      </div>
    );
  }
}

PageGenerator.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      uploaded: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  loadXlsx: PropTypes.func.isRequired,
  families: PropTypes.arrayOf(
    PropTypes.shape({
      family: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
      completed: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default PageGenerator;
