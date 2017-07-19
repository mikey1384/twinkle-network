import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

export default class ButtonGroup extends Component {
  static propTypes = {
    buttons: PropTypes.array.isRequired,
    style: PropTypes.object
  }

  constructor(props) {
    super()
    this.state = {
      buttons: props.buttons.map(button => ({
        ...button,
        hoverClass: button.hoverClass || button.buttonClass
      }))
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.buttons !== this.props.buttons) {
      this.setState({
        buttons: this.props.buttons.map(button => ({
          ...button,
          hoverClass: button.hoverClass || button.buttonClass
        }))
      })
    }
  }

  render() {
    const {style} = this.props
    const {buttons} = this.state
    return (
      <div
        style={style}
        className='btn-group'
      >
        {buttons.map((button, index) => {
          return (
            <Button
              key={index}
              type="button"
              onMouseEnter={() => this.setState({buttons: buttons.map((b, i) => ({
                ...b,
                onHover: i === index
              }))})}
              onMouseLeave={() => this.setState({buttons: buttons.map((b, i) => ({
                ...b,
                onHover: false
              }))})}
              className={`btn ${button.onHover ? button.hoverClass : button.buttonClass}`}
              onClick={button.onClick}
              disabled={button.disabled}
            >
              {button.label}
            </Button>
          )
        })}
      </div>
    )
  }
}
