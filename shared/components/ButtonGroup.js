import React, { Component } from 'react';

export default class ButtonGroup extends Component {
  render() {
    const { pullRight, buttons } = this.props;
    return (
      <div {...this.props}>
        {
          buttons.map(button => {
            return (
              <button
                key={buttons.indexOf(button)}
                type="button"
                className={`btn ${button.buttonClass}`}
                onClick={ button.onClick }
              >
                { button.label }
              </button>
            )
          })
        }
      </div>
    )
  }
}
