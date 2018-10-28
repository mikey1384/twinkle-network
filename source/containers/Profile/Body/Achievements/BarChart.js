import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { rewardValue } from 'constants/defaultValues';
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
                    width: `${barPercentage}%`,
                    height: '2.5rem',
                    marginLeft: '1rem',
                    background: index === 0 ? Color.orange() : Color.logoBlue(),
                    fontSize: '1.5rem',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {`${addCommasToNumber(bar.value * rewardValue.star)} XP`}
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
