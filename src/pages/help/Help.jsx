import React from 'react';
import { Button, Progress, Container, Row, Col, Alert } from 'reactstrap';
import fotor01b from './fotor01b.jpg';
import fotor02b from './fotor02b.jpg';
import fotor03b from './fotor03b.png';

const Help = () => (
  <Container fluid className="page-content help-page">
    <h1>Beskära bilder</h1>
    <ol>
      <li>
        <div>Öppna programmet Fotor och välj Edit.</div>
        <div><img src={fotor01b} alt="" /></div>
      </li>
      <li>Öppna filen du vill använda med File, Open...</li>
      <li>Välj vilken del som ska sparas med Corp, Corp, Square</li>
      <li>Marker ytan du ska använda genom att dra i hörnen på bilden.</li>
      <li>
        <div>Klipp ut med [Done].</div>
        <div><img src={fotor02b} alt="" /></div>
      </li>
      <li>
        <div>Spara genom att trycka på Export, Save to computer.</div>
        <div><img src={fotor03b} alt="" /></div>
      </li>
      <li>Ändra först Resize-fältet till 500</li>
      <li>Välj Quality Normal och tryck på [Save Photo].</li>
      <li>Döp filen och spara den i mappen \Artdatabanken\bilder genom att tryck på [Spara].</li>
      <li>Ta bort dialogen Saved Successfully genom att trycka OK.</li>
      <li>Klart...</li>
    </ol>
  </Container>);

export default Help;
