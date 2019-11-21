import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  onClickAsync: PropTypes.func,
  style: PropTypes.object,
  target: PropTypes.string,
  to: PropTypes.string
};

export default function Link({
  className,
  to,
  onClick = () => {},
  onClickAsync,
  children,
  style,
  target
}) {
  const history = useHistory();
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
      onClick={handleLinkClick}
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

  function handleLinkClick(event) {
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
