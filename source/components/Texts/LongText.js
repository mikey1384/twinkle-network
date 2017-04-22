import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Truncate from './Truncate'
import {limitBrs} from 'helpers/stringHelpers'

export default class LongText extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    style: PropTypes.object,
    lines: PropTypes.number
  }
  constructor(props) {
    super()
    this.state = {
      lines: props.lines || 10
    }
    this.toggleLines = this.toggleLines.bind(this)
  }

  render() {
    const {children, style} = this.props
    const {lines} = this.state
    return (
      <div style={style}>
        <Truncate
          lines={lines}
          ellipsis={<span>... <a style={{cursor: 'pointer'}} onClick={this.toggleLines}>Read more</a></span>}
        >
          <p dangerouslySetInnerHTML={{__html: limitBrs(children)}} />
        </Truncate>
      </div>
    )
  }

  toggleLines() {
    this.setState({lines: 0})
  }
}
