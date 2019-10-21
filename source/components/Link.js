import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onClickAsync: PropTypes.func,
  style: PropTypes.object,
  target: PropTypes.string,
  to: PropTypes.string
};

function Link({
  className,
  to,
  onClick = () => {},
  onClickAsync,
  children,
  style,
  target,
  history
}) {
  return to ? (
    <a
      className={className}
      style={{
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        ...style
      }}
      href={to}
      onClick={onLinkClick}
    >
      {children}
    </a>
  ) : (
    <div
      className={className}
      style={{
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        ...style
      }}
    >
      {children}
    </div>
  );

  function onLinkClick(event) {
    event.preventDefault();
    if (target) return window.open(to, target);
    if (typeof onClickAsync === 'function') {
      return onClickAsync().then(clickSafe => {
        if (!clickSafe) history.push(to);
      });
    }
    history.push(to);
    onClick();
  }
}

export default withRouter(Link);
