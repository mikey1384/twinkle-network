import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';
import CloseText from './CloseText';
import Checkbox from 'components/Checkbox';

FirstPage.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  defaultFilter: PropTypes.string,
  filter: PropTypes.string.isRequired,
  setDefaultSearchFilter: PropTypes.func.isRequired
};

export default function FirstPage({
  changeFilter,
  defaultFilter,
  filter,
  setDefaultSearchFilter
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
      }}
    >
      <div
        className={css`
          height: 50vh;
          width: 80%;
          flex-direction: column;
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${Color.darkerGray()};
          > nav {
            text-align: center;
            > p {
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
        {['video', 'url', 'subject'].map(type =>
          filter === type ? (
            <nav key={type}>
              <p>Search for {(type === 'url' ? 'link' : type) + 's...'}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '100%'
                }}
              >
                <Checkbox
                  backgroundColor="#fff"
                  label={`Always search for ${
                    type === 'url' ? 'link' : type
                  }s first:`}
                  textIsClickable
                  style={{
                    width: 'auto',
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem'
                  }}
                  checked={filter === defaultFilter}
                  onClick={setDefaultSearchFilter}
                />
              </div>
            </nav>
          ) : (
            <a key={type} onClick={() => changeFilter(type)}>
              Search for {(type === 'url' ? 'link' : type) + 's'}
            </a>
          )
        )}
      </div>
      <CloseText />
    </div>
  );
}
