import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Progress, Row, Col, Jumbotron, Table } from 'reactstrap';

class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploaded: [],
      images: props.images,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ images: props.images });
  }

  updateState = (i, url) => {
    const { uploaded } = this.state;
    uploaded[i].uploaded = true;
    uploaded[i].url = url;
  };

  handleFileUpload = (e) => {
    const files = e.target.files;
    const fileArr = [...files];
    const uploaded = fileArr.map((file, i) => ({ name: file.name, uploaded: false, key: i }));
    this.setState({ uploaded });

    this.props.uploadImages(fileArr, this.updateState);
  };

  render() {
    const { uploaded, images } = this.state;

    const progress = () => {
      const currProg = (uploaded.filter(val => val.uploaded === true).length / uploaded.length) * 100;
      return (
        !!uploaded.length && (
          <Progress striped color="success" value={currProg}>
            {currProg}%
          </Progress>
        )
      );
    };

    const sort = (a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    };

    const uploadedImagesGrid =
      uploaded.filter(file => file.url !== undefined).sort(sort).map(file => (
        <Col className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 col" key={file.name}>
          <div>
            <img className="thumbnail" src={file.url} alt={file.name} />
          </div>
          <div className="filename">{file.name}</div>
        </Col>
      ));

    /* eslint react/no-array-index-key: 0 */
    const imageTable = imgs =>
      imgs.filter(file => file.url !== undefined).sort(sort).map((file, index) => (
        <tr key={index}>
          <td>{index}</td>
          <td><img className="thumbnail" src={file.url} alt={file.name} /></td>
          <td><div className="filename">{file.name}</div></td>
        </tr>
      ));

    return (
      <div className="images-page">
        {uploaded.length > 0 && <Jumbotron>
          <h2>Nya bilder</h2>
          <div className="progress-wrapper">{progress()}</div>
          <Row className="image-grid">{uploadedImagesGrid}</Row>
        </Jumbotron>}

        <Row>
          <Col className="col-6">
            <h1>Bilder</h1>
          </Col>

          <Col className="col-6">
            <label className="btn btn-success btn-file-upload" htmlFor="fileUpload">
              Ladda upp bilder
              <input type="file" onChange={this.handleFileUpload} id="fileUpload" multiple />
            </label>
          </Col>
        </Row>

        <Table striped hover responsive className="image-table">
          <thead>
            <tr>
              <th>#</th>
              <th >Bild</th>
              <th className="w-100">Filnamn</th>
            </tr>
          </thead>
          <tbody>
            {imageTable(images)}
          </tbody>
        </Table>

      </div>
    );
  }
}

Images.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  uploadImages: PropTypes.func.isRequired,
};

export default Images;
