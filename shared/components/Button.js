import React, {Component, PropTypes} from 'react';

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.array
    ])
  }

  render() {
    const {onClick, children = null} = this.props;
    return (
      <button
        {...this.props}
        ref={ref => this.Button = ref}
        onClick={event => {
          if (this.Button !== null) this.Button.blur();
          if (!!onClick) onClick(event)
        }}
      >
        {children}
      </button>
    )
  }
}
