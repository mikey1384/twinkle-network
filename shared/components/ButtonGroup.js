import React, { Component } from 'react';

export default class ButtonGroup extends Component {
  render() {
    const { pullRight, buttons } = this.props;
    let buttonIndex = 0;
    return (
      <div
        {...this.props}
        className='btn-group'
      >
        {
          buttons.map(button => {
            const index = buttonIndex++;
            return (
              <button
                key={index}
                type="button"
                className={`btn ${button.buttonClass}`}
                onClick={ button.onClick }
                disabled={ button.disabled }
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
