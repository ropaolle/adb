import React from 'react';
import { Row, Col } from 'reactstrap';
import banner from './banner.jpg';
import ex1 from './ex1.jpg';
import ex2 from './ex2.jpg';
import ex3 from './ex3.jpg';

const Pages = function dude() {
  return (
    <div className="home-page">
      <div className="banner">
        <img src={banner} alt="bird-banner" />
        <h1 className="d-none">Artdatabanken</h1>
      </div>
      <Row>
        <Col>Ett <a href="https://github.com/SheetJS/js-xlsx">JS-XLSX</a>-projekt byggt med React/Firebase som skapar artdatabasfiler från en Excelbaserad artdatabank.</Col>
      </Row>
      <Row>
        <Col xs="12" md="4" className="mb-4"><img src={ex3} alt="art-card" /></Col>
        <Col xs="12" md="4" className="mb-4"><img src={ex1} alt="art-card" /></Col>
        <Col xs="12" md="4" className="mb-4"><img src={ex2} alt="art-card" /></Col>
      </Row>
    </div>
  );
};

export default Pages;
