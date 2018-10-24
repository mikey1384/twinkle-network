import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { css } from 'emotion';

export default class StatusMsg extends Component {
  static propTypes = {
    statusColor: PropTypes.string,
    statusMsg: PropTypes.string.isRequired,
    style: PropTypes.object
  };
  render() {
    const { statusColor = 'logoBlue', statusMsg, style } = this.props;
    return (
      <div
        className={css`
          background: ${Color[statusColor]()};
          color: ${statusColor === 'ivory' ? Color.black() : '#fff'};
          font-size: 1.7rem;
          padding: 1rem;
          margin-top: 1rem;
          box-shadow: 0 5px 5px ${Color.lightGray()};
          overflow-wrap: break-word;
          word-break: break-word;
          > a {
            color: ${statusColor === 'ivory'
              ? Color.blue()
              : statusColor === 'logoGreen'
                ? Color.ivory()
                : Color.gold()};
          }
        `}
        dangerouslySetInnerHTML={{
          __html: processedStringWithURL(statusMsg)
        }}
        style={style}
      />
    );
  }
}
