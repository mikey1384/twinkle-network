import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';

export default class LongText extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    cleanString: PropTypes.bool,
    maxLines: PropTypes.number,
    style: PropTypes.object,
    noExpand: PropTypes.bool
  };

  mounted = false;

  state = {
    text: '',
    more: false,
    fullText: false
  };

  componentDidMount() {
    const { children } = this.props;
    this.mounted = true;
    this.truncateText(children || '');
  }

  componentDidUpdate(prevProps) {
    const { children } = this.props;
    if (prevProps.children !== children && this.mounted) {
      this.setState({
        text: '',
        more: false,
        fullText: false
      });
      this.truncateText(children || '');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      style,
      className,
      cleanString,
      children = '',
      noExpand
    } = this.props;
    const { text, more, fullText } = this.state;
    return (
      <div
        ref={ref => {
          this.Container = ref;
        }}
        style={style}
        className={className}
      >
        <p
          ref={ref => {
            this.Text = ref;
          }}
        >
          {fullText ? (
            <span
              dangerouslySetInnerHTML={{
                __html: limitBrs(
                  cleanString ? children : processedStringWithURL(children)
                )
              }}
            />
          ) : (
            <Fragment>
              <span
                dangerouslySetInnerHTML={{
                  __html: limitBrs(
                    cleanString ? text : processedStringWithURL(text)
                  )
                }}
              />
              {more && (
                <Fragment>
                  {'... '}
                  {!noExpand && (
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.setState({ fullText: true })}
                    >
                      Read More
                    </a>
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
        </p>
      </div>
    );
  }

  truncateText = originalText => {
    const { maxLines = 10 } = this.props;
    const maxWidth = this.Text.clientWidth;
    const canvas = document.createElement('canvas').getContext('2d');
    const computedStyle = window.getComputedStyle(this.Container);
    const font = `${computedStyle['font-weight']} ${
      computedStyle['font-style']
    } ${computedStyle['font-size']} ${computedStyle['font-family']}`;
    canvas.font = font;
    let line = '';
    let numLines = 0;
    let trimmedText = '';
    for (let i = 0; i < originalText.length; i++) {
      line += originalText[i];
      if (
        originalText[i] === '\n' ||
        canvas.measureText(line).width > maxWidth
      ) {
        numLines++;
        trimmedText += line;
        line = '';
      }
      if (numLines === maxLines && i < originalText.length - 1) {
        const remainingText = originalText.slice(i + 1);
        let more = true;
        if (
          remainingText[0] !== '\n' &&
          canvas.measureText(remainingText).width < maxWidth
        ) {
          trimmedText += remainingText;
          more = false;
        }
        return this.setState({ text: trimmedText, more });
      }
    }
    this.setState({ text: trimmedText + line || line });
  };
}
