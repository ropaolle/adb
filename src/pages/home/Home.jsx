import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import banner from './banner.jpg';
import ex from './ex.jpg';

const Pages = function dude() {
  return (
    <div className="home-page">
      <div className="banner">
        <img src={banner} alt="bird-banner" />
        <h1>Artdatabanken</h1>
      </div>
      <Row>
        <Col>Ett <a href="https://github.com/SheetJS/js-xlsx">JS-XLSX</a>-projekt byggt med React/Firebase som skapar artdatabasfiler från en Excelbaserad artdatabank.</Col>
      </Row>
      <Row>
        <Col><img src={ex} alt="art-card" /></Col>
        <Col><img src={ex} alt="art-card" /></Col>
        <Col><img src={ex} alt="art-card" /></Col>
      </Row>
    </div>
  );
};

export default Pages;
