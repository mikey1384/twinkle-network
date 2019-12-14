import PropTypes from 'prop-types';
import React from 'react';
import { css } from 'emotion';
import { borderRadius, innerBorderRadius, Color } from 'constants/css';

CheckListGroup.propTypes = {
  inputType: PropTypes.string,
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      checked: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CheckListGroup({
  listItems,
  inputType = 'checkbox',
  onSelect,
  style = {}
}) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        nav {
          border: 1px solid ${Color.borderGray()};
          border-top: none;
        }
        nav:first-of-type {
          border: 1px solid ${Color.borderGray()};
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
          section {
            border-top-left-radius: ${innerBorderRadius};
          }
        }
        nav:last-child {
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
          section {
            border-bottom-left-radius: ${innerBorderRadius};
          }
        }
      `}
      style={style}
    >
      {listItems.map((listItem, index) => {
        return (
          <nav
            className={css`
              display: flex;
              align-items: center;
              width: 100%;
              cursor: pointer;
              &:hover {
                background: ${Color.highlightGray()};
              }
            `}
            onClick={() => onSelect(index)}
            key={index}
          >
            <section
              className={css`
                height: 4.3rem;
                width: 4.3rem;
                background: ${Color.checkboxAreaGray()};
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <input
                type={inputType}
                checked={listItem.checked}
                onChange={() => onSelect(index)}
              />
            </section>
            <div
              style={{ padding: '0 2rem' }}
              dangerouslySetInnerHTML={{ __html: listItem.label }}
            />
          </nav>
        );
      })}
    </div>
  );
}
