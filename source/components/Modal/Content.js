import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useOutsideClick } from 'helpers/hooks';

Content.propTypes = {
  onHide: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

export default function Content({ children, className, onHide }) {
  const ContentRef = useRef();
  useOutsideClick(ContentRef, () => onHide?.());
  return (
    <div className={className} ref={ContentRef}>
      <button className="close" onClick={onHide}>
        <Icon icon="times" />
      </button>
      {children}
    </div>
  );
}
