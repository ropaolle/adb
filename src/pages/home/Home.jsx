import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardBody,
  CardTitle,
  CardFooter,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { dateToString } from '../../utils/xlsx';
import missing from '../generator/missing.svg';
import banner from './banner.jpg';

const Pages = function dude(props) {
  const { families, images } = props;

  const pageHeader = row => (
    <div>
      <div className="page-sub-main">
        <span className="klass">Klass:<i>{row.kingdom}{' '}</i></span>
        <span className="ordning">Ordning:<i>{row.order}{' '}</i></span>
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

  const getCard = item => (<Col xs="6" sm="4" lg="3" xl="2" className="mb-4" key={item.id}>
    <Card>
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
    </Card></Col>);

  const pages = families.map(family => (<div key={family.id}>
    <Row id={`toc-${family.id}`}><Col>{pageHeader(family.data[0])}</Col></Row>
    <Row key={family.data[0].id}>
      {family.data.map(card => getCard(card))}
    </Row>
  </div>));

  const toc = families.map(family => (
    <li key={family.id}>
      <a href={`#toc-${family.id}`}>{family.family}</a>
      <div>
        {family.data.map((val, i) => <span key={i}>{val.speices}{family.data.length - 1 !== i ? <i>|</i> : ''}</span>)}
      </div>
    </li>
  ));

  return (
    <div>
      <div className="banner" >
        <img src={banner} alt="bird-banner" />
        <h1>Artdatabanken</h1>
      </div>
      <Container fluid className="page-content home-page">

        <h1>Innehåll</h1>
        <ol>{toc}</ol>
        { families && pages }
      </Container>
      <div className="footer">
        <Row><Col>Footer</Col><Col>Info</Col></Row>
      </div>
    </div>
  );
};

Pages.propTypes = {
  families: PropTypes.arrayOf(
    PropTypes.shape({
      family: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
      completed: PropTypes.bool.isRequired,
    }),
  ),
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      uploaded: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

Pages.defaultProps = {
  families: [],
};

export default Pages;
