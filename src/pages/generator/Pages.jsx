import React from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash.chunk';
import Page from './Page';

const Pages = function dude(props) {
  // console.log('FULL', props.families);
  const pages = props.families.map(family =>
    chunk(family.data, 9).map(page => (
      <Page
        page={page}
        completed={family.completed && props.completed}
        key={page[0].id}
        images={props.images}
      />
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
