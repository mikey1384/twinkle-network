import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'context';

Categories.propTypes = {
  defaultFilter: PropTypes.string,
  filter: PropTypes.string.isRequired,
  onSetDefaultSearchFilter: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function Categories({
  defaultFilter,
  filter,
  onSetDefaultSearchFilter,
  style
}) {
  const {
    user: {
      state: { profileTheme }
    }
  } = useAppContext();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        ...style
      }}
    >
      <div
        className={css`
          width: 80%;
          flex-direction: column;
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${Color[profileTheme]()};
          > nav {
            text-align: center;
            > p {
              cursor: default;
              font-weight: bold;
              text-transform: capitalize;
              font-size: 3.5rem;
            }
            span {
              font-size: 1.5rem;
            }
          }
          > a {
            line-height: 1.8;
            font-size: 2.7rem;
            cursor: pointer;
            text-transform: capitalize;
            color: ${Color.gray()};
          }
        `}
      >
        {['subjects', 'videos', 'links'].map(contentType =>
          filter === contentType ? (
            <nav key={contentType}>
              <p>Explore {contentType}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '100%'
                }}
              >
                <Checkbox
                  backgroundColor="#fff"
                  label={`Always explore ${contentType} first:`}
                  textIsClickable
                  style={{
                    width: 'auto',
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem'
                  }}
                  checked={filter === defaultFilter}
                  onClick={onSetDefaultSearchFilter}
                />
              </div>
            </nav>
          ) : (
            <Link key={contentType} to={contentType}>
              Explore {contentType}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
