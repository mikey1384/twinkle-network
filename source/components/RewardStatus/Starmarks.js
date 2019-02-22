import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

Starmarks.propTypes = {
  stars: PropTypes.number.isRequired
};

export default function Starmarks({ stars }) {
  const baselines = [
    { baseline: 10, icon: ['far', 'star-half-alt'] },
    { baseline: 20, icon: ['far', 'star'] },
    { baseline: 30, icon: 'star-half-alt' },
    { baseline: 40, icon: 'star' }
  ];
  let starMarks = [];
  for (let i = 0; i < Math.min(stars, 10); i++) {
    starMarks.push(
      <Icon
        key={i}
        icon="certificate"
        style={{ marginLeft: i !== 0 && '0.2rem' }}
      />
    );
  }
  for (let { baseline, icon } of baselines) {
    if (stars <= baseline) break;
    starMarks = starMarks.map((starMark, index) =>
      index < Math.min(stars - baseline, baseline) ? (
        <Icon
          key={index}
          icon={icon}
          style={{ marginLeft: index !== 0 && '0.2rem' }}
        />
      ) : (
        starMark
      )
    );
  }

  return <div>{starMarks}</div>;
}
