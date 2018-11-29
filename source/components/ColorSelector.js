import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import Icon from 'components/Icon';
import FullTextReveal from 'components/FullTextReveal';
import { addCommasToNumber } from 'helpers/stringHelpers';

const requirement = {
  black: 35000
};

export default class ColorSelector extends Component {
  static propTypes = {
    colors: PropTypes.array.isRequired,
    twinkleXP: PropTypes.number.isRequired,
    setColor: PropTypes.func.isRequired,
    selectedColor: PropTypes.string,
    style: PropTypes.object
  };

  highlightEffects = {
    border: `0.5rem solid #fff`,
    boxShadow: `0 0 5px #fff`
  };

  state = {
    hovered: undefined
  };

  render() {
    const { colors, setColor, selectedColor, style, twinkleXP } = this.props;
    const { hovered } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          ...style
        }}
      >
        {colors.map(color => (
          <div key={color}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: Color[color](),
                cursor:
                  twinkleXP >= (requirement[color] || -1)
                    ? 'pointer'
                    : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(selectedColor !== color ? this.highlightEffects : {})
              }}
              onClick={
                twinkleXP >= (requirement[color] || -1)
                  ? () => setColor(color)
                  : () => {}
              }
              onMouseEnter={() => this.setState({ hovered: color })}
              onMouseLeave={() => this.setState({ hovered: undefined })}
            >
              {twinkleXP < (requirement[color] || -1) && <Icon icon="lock" />}
            </div>
            {twinkleXP < (requirement[color] || -1) &&
              hovered === color && (
                <FullTextReveal
                  show
                  direction="left"
                  style={{ color: '#000' }}
                  text={`Requires ${addCommasToNumber(requirement[color])} XP`}
                />
              )}
          </div>
        ))}
      </div>
    );
  }
}
