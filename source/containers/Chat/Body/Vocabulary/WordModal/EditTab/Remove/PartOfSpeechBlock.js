import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';
import { css } from 'emotion';

PartOfSpeechBlock.propTypes = {
  deletedDefIds: PropTypes.array.isRequired,
  type: PropTypes.string,
  onListItemClick: PropTypes.func.isRequired,
  defIds: PropTypes.array.isRequired,
  posObject: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function PartOfSpeechBlock({
  deletedDefIds,
  type,
  onListItemClick,
  defIds,
  posObject,
  style
}) {
  return defIds.length > 0 ? (
    <div style={style}>
      <p
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
      >
        {type}
      </p>
      <div
        className={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          nav {
            align-items: center;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            margin-bottom: -1px;
            border: 1px solid ${Color.borderGray()};
          }
          nav:first-of-type {
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
          }
          nav:last-child {
            border-bottom-left-radius: ${borderRadius};
            border-bottom-right-radius: ${borderRadius};
          }
        `}
      >
        {defIds.map((id, index) => {
          return (
            <nav
              key={id}
              onClick={() => onListItemClick(id)}
              style={{
                opacity: deletedDefIds.includes(id) ? 0.5 : 1,
                cursor: 'pointer',
                borderTop: index === 0 && `1px solid ${Color.borderGray()}`,
                color: Color.darkerGray()
              }}
            >
              <section
                style={{
                  textDecoration: deletedDefIds.includes(id)
                    ? 'line-through'
                    : ''
                }}
              >
                {posObject[id].title}
              </section>
              <Icon icon="trash-alt" style={{ marginLeft: '2rem' }} />
            </nav>
          );
        })}
      </div>
    </div>
  ) : null;
}
