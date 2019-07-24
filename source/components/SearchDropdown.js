import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from 'emotion';

Dropdown.propTypes = {
  dropdownTitle: PropTypes.string,
  indexToHighlight: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  renderItemLabel: PropTypes.func.isRequired,
  renderItemUrl: PropTypes.func,
  searchResults: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function Dropdown({
  dropdownTitle,
  indexToHighlight,
  searchResults,
  onUpdate,
  style = {},
  onItemClick,
  renderItemLabel,
  renderItemUrl
}) {
  useEffect(() => {
    onUpdate();
  }, [searchResults]);

  return (
    <ErrorBoundary
      className={css`
        position: absolute;
        top: 1rem;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 1px 1px 5px ${Color.black()};
        top: CALC(4.3rem - 1px);
      `}
      style={style}
    >
      <div
        className={css`
          width: 100%;
          cursor: pointer;
          display: block;
          nav {
            padding: 1rem;
            color: ${Color.darkerGray()};
            &:hover {
              background: ${Color.highlightGray()};
            }
            a {
              text-decoration: none;
              color: ${Color.darkerGray()};
            }
          }
        `}
      >
        {searchResults.map((item, index) => {
          let itemStyle =
            index === indexToHighlight
              ? { background: Color.highlightGray() }
              : {};
          const href = renderItemUrl ? { href: renderItemUrl(item) } : {};
          return (
            <nav
              key={index}
              style={{
                width: '100%',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                ...itemStyle
              }}
              onClick={() => onItemClick(item)}
            >
              <a
                {...href}
                style={{
                  lineHeight: 'normal'
                }}
                onClick={e => e.preventDefault()}
              >
                {renderItemLabel(item)}
              </a>
            </nav>
          );
        })}
        {dropdownTitle && (
          <div style={{ padding: '1rem' }}>{dropdownTitle}</div>
        )}
      </div>
    </ErrorBoundary>
  );
}
