import React from 'react';
import PropTypes from 'prop-types';

DictionaryTab.propTypes = {
  posObj: PropTypes.object.isRequired,
  posOrder: PropTypes.array.isRequired
};

export default function DictionaryTab({ posObj, posOrder }) {
  console.log(posObj);
  return (
    <div>
      {posOrder.map(pos => (
        <div key={pos}>
          <p>{pos}</p>
        </div>
      ))}
    </div>
  );
}
