import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Truncate from './Truncate'
import {limitBrs, processedStringWithURL} from 'helpers/stringHelpers'

export default class LongText extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    lines: PropTypes.number,
    style: PropTypes.object
  }
  constructor(props) {
    super()
    this.state = {
      lines: props.lines || 10
    }
    this.toggleLines = this.toggleLines.bind(this)
  }

  render() {
    const {children, style, className} = this.props
    const {lines} = this.state
    return (
      <div style={style} className={className}>
        <Truncate
          lines={lines}
          ellipsis={<span>... <a style={{cursor: 'pointer'}} onClick={this.toggleLines}>Read more</a></span>}
        >
          <p dangerouslySetInnerHTML={{__html: limitBrs(processedStringWithURL(children))}} />
        </Truncate>
      </div>
    )
  }

  toggleLines() {
    this.setState({lines: 0})
  }
}
