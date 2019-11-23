import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';

BarChart.propTypes = {
  bars: PropTypes.array.isRequired,
  topValue: PropTypes.number
};

export default function BarChart({ bars, topValue }) {
  const Bars = useMemo(
    () =>
      bars.map((bar, index) => (
        <Bar
          key={bar.id}
          index={index}
          bar={bar}
          barPercentage={Math.floor((bar.value * 100) / topValue)}
        />
      )),
    [bars, topValue]
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginLeft: '-2rem'
        }}
      >
        {Bars}
      </div>
    </div>
  );
}
