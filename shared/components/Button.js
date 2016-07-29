import React, {Component, PropTypes} from 'react';

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.array
    ]),
    disabled: PropTypes.bool,
    style: PropTypes.object
  }

  render() {
    const {onClick, disabled = false, className = null, style = {}, children = null} = this.props;
    return (
      <button
        style={style}
        className={className}
        ref={ref => this.Button = ref}
        onClick={() => {
          if (this.Button !== null) this.Button.blur();
          onClick()
        }}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
}
