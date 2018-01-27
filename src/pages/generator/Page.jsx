import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardBody,
  CardTitle,
  CardFooter,
} from 'reactstrap';
import chunk from 'lodash.chunk';
import { dateToString } from '../../utils/xlsx';
import missing from './missing.svg';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = { dummy: '' };
  }

  render() {
    const { page, completed, images } = this.props;

    const pageHeader = (row, compl) => (
      <div>
        <h2 className="page-header">
          Artdatabanken<span>{compl ? 'Komplett' : ''}</span>
        </h2>
        <div className="page-sub">
          <span className="klass">Klass:<i>{row.kingdom}</i></span>
          <span className="ordning">Ordning:<i>{row.order}</i></span>
          <span className="familj">Familj:<i>{row.family}</i></span>
        </div>
      </div>);

    const sexIcons = (item) => {
      if (!item.sex) return (<span />);

      const icons = [];
      const hane = item.sex.toLocaleLowerCase().indexOf('hane');
      const hona = item.sex.toLocaleLowerCase().indexOf('hona');
      if (hane > -1) {
        icons.push(<i className="fa fa-mars" key="1" />);
        if (hona > hane) icons.push(<i className="fa fa-venus" key="2" />);
      } else if (hona > -1) {
        icons.push(<i className="fa fa-venus" key="2" />);
        if (hona < hane) icons.push(<i className="fa fa-mars" key="4" />);
      }
      return (<span>{icons}</span>);
    };

    const imgSrc = (name) => {
      const imageExists = images.find(image => image.name === name);
      return (imageExists) ? imageExists.url : missing;
    };

    const card = item => (
      <Card key={item.id}>
        <CardImg top width="100%" src={imgSrc(item.image)} alt={item.speices} />
        {!item.image && <CardImgOverlay>Saknas</CardImgOverlay>}
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
          <span className="float-right">{dateToString(item.date)}</span>
        </CardFooter>
      </Card>);

    const cards = data => chunk(data, 3).map(row =>
      (<div className="card-deck mb-4" key={row[0].id}>
        {row.map(item => card(item))}
        {/* TODO: Row format wrong if we don't supply 3 rows. */}
        {row.length < 3 && <Card className="dummy" key="dummyCard01" />}
        {row.length < 2 && <Card className="dummy" key="dummyCard02" />}
      </div>));

    return (
      <div className="page">
        {pageHeader(page[0], completed)}
        {cards(page)}
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
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      uploaded: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default Page;
