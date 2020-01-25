import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import Button from 'components/Button';
import DropdownList from 'components/DropdownList';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import { useOutsideClick } from 'helpers/hooks';
import { css } from 'emotion';

DropdownButton.propTypes = {
  buttonStyle: PropTypes.object,
  icon: PropTypes.string,
  iconSize: PropTypes.string,
  direction: PropTypes.string,
  onButtonClick: PropTypes.func,
  onOutsideClick: PropTypes.func,
  listStyle: PropTypes.object,
  menuProps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  noBorderRadius: PropTypes.bool,
  opacity: PropTypes.number,
  stretch: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.any
};

export default function DropdownButton({
  buttonStyle = {},
  direction,
  opacity = 1,
  style,
  icon = 'pencil-alt',
  iconSize = '1x',
  listStyle = {},
  menuProps,
  noBorderRadius,
  onButtonClick,
  onOutsideClick,
  text = '',
  stretch,
  ...props
}) {
  const [menuDisplayed, setMenuDisplayed] = useState(false);
  const [mouseEntered, setMouseEntered] = useState(false);
  const ButtonRef = useRef(null);
  useOutsideClick(ButtonRef, () => {
    if (menuDisplayed && typeof onOutsideClick === 'function') {
      onOutsideClick();
    }
    setMenuDisplayed(false);
  });

  return (
    <ErrorBoundary style={{ position: 'relative', ...style }}>
      <div ref={ButtonRef}>
        <Button
          {...props}
          onMouseEnter={() => setMouseEntered(true)}
          onMouseLeave={() => setMouseEntered(false)}
          style={{
            borderRadius: noBorderRadius && 0,
            border: noBorderRadius && 0,
            margin: noBorderRadius && 0,
            opacity: menuDisplayed || mouseEntered ? 1 : opacity,
            ...(stretch ? { width: '100%' } : {}),
            ...buttonStyle
          }}
          onClick={onClick}
        >
          <Icon icon={icon} size={iconSize} />
          {text && <span>&nbsp;&nbsp;</span>}
          {text}
        </Button>
        {menuDisplayed && (
          <DropdownList
            style={{
              textTransform: 'none',
              minWidth: '12rem',
              ...listStyle
            }}
            direction={direction}
          >
            {renderMenu()}
          </DropdownList>
        )}
      </div>
    </ErrorBoundary>
  );

  function onClick() {
    if (typeof onButtonClick === 'function') {
      onButtonClick(menuDisplayed);
    }
    setMenuDisplayed(!menuDisplayed);
  }

  function renderMenu() {
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return <hr key={index} />;
      }
      return (
        <li
          style={{
            opacity: prop.disabled && 0.3,
            cursor: prop.disabled ? 'default' : 'pointer'
          }}
          className={
            prop.disabled
              ? css`
                  &:hover {
                    background: #fff !important;
                  }
                `
              : ''
          }
          onClick={
            prop.disabled ? () => {} : () => handleMenuClick(prop.onClick)
          }
          key={index}
        >
          {prop.label}
        </li>
      );
    });
  }

  function handleMenuClick(action) {
    action();
    setMenuDisplayed(false);
  }
}
