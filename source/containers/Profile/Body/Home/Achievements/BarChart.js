import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

export default class BarChart extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data } = this.props;
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
          {data.bars?.map((bar, index) => {
            const barPercentage = Math.floor((bar.value * 100) / data.topValue);
            return (
              <section
                key={bar.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: index === 0 ? 0 : '1rem'
                }}
              >
                <div
                  style={{
                    fontSize: '1.3rem',
                    width: '2.5rem'
                  }}
                >
                  {bar.label}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    minWidth: `${barPercentage}%`,
                    padding: '0.5rem',
                    marginLeft: '1rem',
                    background: index === 0 ? Color.orange() : Color.logoBlue(),
                    fontSize: '1.5rem',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {`${addCommasToNumber(bar.value)} XP`}
                </div>
                {barPercentage < 100 && (
                  <div style={{ width: `${100 - barPercentage}%` }} />
                )}
              </section>
            );
          })}
        </div>
      </div>
    );
  }
}
