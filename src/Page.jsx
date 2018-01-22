import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
} from 'reactstrap';
import chunk from 'lodash.chunk';
import parsXlsx, { getDateString } from './xlsx';
import './App.css';


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

    const pageHeader = (row, completed) => (
      <div>
        <h2 className="page-header">
          Artdatabanken<span>{completed ? 'Komplett' : ''}</span>
        </h2>
        <div className="page-sub-header">
          <span className="klass">Klass:<i>{row.kingdom}</i></span>
          <span className="ordning">Ordning:<i>{row.order}</i></span>
          <span className="familj">Familj:<i>{row.family}</i></span>
        </div>
      </div>);

    const sexIcons = (item) => {
      if (!item.sex) return (<span />);
      const hane = item.sex.toLocaleLowerCase().indexOf('hane');
      const hona = item.sex.toLocaleLowerCase().indexOf('hona');
      const icons = [];
      if (hane > hona) {
        if (hona > -1) icons.push(<i className="fa fa-venus" />);
        icons.push(<i className="fa fa-mars" />);
      } else if (hona > hane) {
        if (hane > -1) icons.push(<i className="fa fa-mars" />);
        icons.push(<i className="fa fa-venus" />);
      }
      return (<span>{icons}</span>);
    };

    const cardTitle = item => (
      <div>
        <span>{item.speices}{' '}</span>
        {sexIcons(item)}
        {item.speices_latin && <span>({item.speices_latin})</span>}
      </div>);

    const footer = item => (<span>
      <span>{item.place}</span>
      {item.county && <span> ({item.county})</span>}
      <span className="float-right">{getDateString(item.date)}</span>
    </span>);

    const card = item => (
      <Card>
        <CardImg top width="100%" src="./images/bird-500x500.jpg" alt={item.speices} />
        <CardBody>
          <CardTitle>{cardTitle(item)}</CardTitle>
        </CardBody>
        <CardFooter>{footer(item)}</CardFooter>
      </Card>);

    const cards = data => chunk(data, 3).reduce((acc, row) => {
      // console.log('row', row);
      acc.push(<div className="card-deck mb-4">{row.map(item => card(item))}</div>);
      return acc;
    }, []);

    const html = families.map(family => (
      <div className="page">
        {pageHeader(family.data[0], family.completed)}
        <div>{cards(family.data)}</div>
      </div>));

    return (
      <div>
        <div id="content" className="page-wrapper">{html}</div>
      </div>
    );
  }
}

export default App;
