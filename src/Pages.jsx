import React from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash.chunk';
import Page from './Page';

const Pages = function dude(props) {
  const { families } = props;
  console.log('FULL', families);

  const pages = families.map(family =>
    chunk(family.data, 9).map(page => (
      <Page page={page} completed={family.completed} key={page[0].id} />
    )),
  );

  return <div className="pages">{pages}</div>;
};

Pages.propTypes = {
  families: PropTypes.arrayOf(
    PropTypes.shape({
      family: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
      completed: PropTypes.bool.isRequired,
    }),
  ),
};

Pages.defaultProps = {
  families: [],
};

export default Pages;
