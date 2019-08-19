import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { connect } from 'react-redux';

Categories.propTypes = {
  changeFilter: PropTypes.func.isRequired,
  defaultFilter: PropTypes.string,
  filter: PropTypes.string.isRequired,
  profileTheme: PropTypes.string,
  setDefaultSearchFilter: PropTypes.func.isRequired,
  style: PropTypes.object
};

function Categories({
  changeFilter,
  defaultFilter,
  filter,
  profileTheme,
  setDefaultSearchFilter,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
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
          color: ${Color[themeColor]()};
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
        {['subject', 'video', 'url'].map(type =>
          filter === type ? (
            <nav key={type}>
              <p>Explore {(type === 'url' ? 'link' : type) + 's...'}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '100%'
                }}
              >
                <Checkbox
                  backgroundColor="#fff"
                  label={`Always explore ${
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
              Explore {(type === 'url' ? 'link' : type) + 's'}
            </a>
          )
        )}
      </div>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(Categories);
