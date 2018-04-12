import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers'

export default class LongText extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    maxLines: PropTypes.number,
    style: PropTypes.object
  }

  state = {
    text: '',
    more: false,
    fullText: false
  }

  componentDidMount() {
    this.truncateText(this.props.children)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.truncateText(this.props.children)
    }
  }

  render() {
    const { style, className, children } = this.props
    const { text, more, fullText } = this.state
    return (
      <div
        ref={ref => {
          this.Container = ref
        }}
        style={style}
        className={className}
      >
        {fullText ? (
          <span
            dangerouslySetInnerHTML={{
              __html: limitBrs(processedStringWithURL(children))
            }}
          />
        ) : (
          <Fragment>
            <p
              ref={ref => {
                this.Text = ref
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: limitBrs(processedStringWithURL(text))
                }}
              />
              {more && (
                <Fragment>
                  {'... '}
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.setState({ fullText: true })}
                  >
                    Read More
                  </a>
                </Fragment>
              )}
            </p>
          </Fragment>
        )}
      </div>
    )
  }

  truncateText = originalText => {
    const { maxLines = 10 } = this.props
    const maxWidth = this.Text.getBoundingClientRect().width
    const canvas = document.createElement('canvas').getContext('2d')
    const computedStyle = window.getComputedStyle(this.Container)
    const font = `${computedStyle['font-weight']} ${
      computedStyle['font-style']
    } ${computedStyle['font-size']} ${computedStyle['font-family']}`
    canvas.font = font
    let line = ''
    let numLines = 0
    let trimmedText = ''
    for (let i = 0; i < originalText.length; i++) {
      line += originalText[i]
      if (originalText[i] === '\n' || canvas.measureText(line).width > maxWidth) {
        numLines++
        trimmedText += line
        line = ''
      }
      if (numLines === maxLines) {
        const finalText = trimmedText
          .split('\n')
          .filter((line, index) => index < 10)
          .join('\n')
        return this.setState({ text: finalText, more: true })
      }
    }
    this.setState({ text: trimmedText + line || line })
  }
}
