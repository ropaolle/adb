import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardFooter,
} from 'reactstrap';
import chunk from 'lodash.chunk';
import { getDateString } from './xlsx';


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = { dummy: '' };
  }

  render() {
    const { page, completed } = this.props;

    const pageHeader = (row, compl) => (
      <div>
        <h2 className="page-header">
          Artdatabanken<span>{compl ? 'Komplett' : ''}</span>
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
        if (hona > -1) icons.push(<i className="fa fa-venus" key="1" />);
        icons.push(<i className="fa fa-mars" key="2" />);
      } else if (hona > hane) {
        if (hane > -1) icons.push(<i className="fa fa-mars" key="3" />);
        icons.push(<i className="fa fa-venus" key="4" />);
      }
      return (<span>{icons}</span>);
    };

    const card = item => (
      <Card key={item.id}>
        <CardImg top width="100%" src="./images/bird-500x500.jpg" alt={item.speices} />
        <CardBody>
          <CardTitle>
            <span>{item.speices}{' '}</span>
            {sexIcons(item)}
            {item.speices_latin && <span>({item.speices_latin})</span>}
          </CardTitle>
        </CardBody>
        <CardFooter>
          <span>{item.place}</span>
          {item.county && <span> ({item.county})</span>}
          <span className="float-right">{getDateString(item.date)}</span>
        </CardFooter>
      </Card>);

    const cards = data => chunk(data, 3).map((row) => {
      console.log('row', row);
      return (<div className="card-deck mb-4" key={row[0].id}>
        {row.map(item => card(item))}
      </div>);
    });

    // console.log('p2', page);
    // console.log('p3', completed);

    return (
      <div className="page">
        {pageHeader(page[0], completed)}
        <div>{cards(page)}</div>
      </div>
    );
  }
}

Page.propTypes = {
  completed: PropTypes.bool.isRequired,
  page: PropTypes.arrayOf(PropTypes.shape({
    kingdom: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
    family: PropTypes.string.isRequired,
    county: PropTypes.string,
    date: PropTypes.number,
    image: PropTypes.string,
    place: PropTypes.string,
    sex: PropTypes.string,
    speices: PropTypes.string,
    speices_latin: PropTypes.string,
  })).isRequired,
};

export default Page;
