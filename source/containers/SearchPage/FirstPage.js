import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';
import CloseText from './CloseText';
import Checkbox from 'components/Checkbox';

export default class FirstPage extends Component {
  static propTypes = {
    changeFilter: PropTypes.func.isRequired,
    defaultFilter: PropTypes.string,
    filter: PropTypes.string.isRequired,
    onSearchBoxFocus: PropTypes.func.isRequired,
    setDefaultSearchFilter: PropTypes.func.isRequired
  };
  render() {
    const { defaultFilter, filter } = this.props;
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
            font-size: 3rem;
            color: ${Color.darkGray()};
            > nav {
              text-align: center;
              > p {
                font-weight: bold;
                text-transform: capitalize;
              }
              span {
                font-size: 1.5rem;
              }
            }
            > a {
              font-size: 2.7rem;
              cursor: pointer;
              text-transform: capitalize;
              color: ${Color.gray()};
            }
          `}
        >
          {['video', 'url', 'question', 'discussion'].map(
            type =>
              filter === type ? (
                <nav key={type}>
                  <p>
                    Search for{' '}
                    {(type === 'url'
                      ? 'link'
                      : type === 'question'
                        ? 'subject'
                        : type) + 's...'}
                  </p>
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
                      onClick={this.setDefaultSearchFilter}
                    />
                  </div>
                </nav>
              ) : (
                <a key={type} onClick={() => this.changeFilter(type)}>
                  Search {(type === 'url' ? 'link' : type) + 's'}
                </a>
              )
          )}
        </div>
        <CloseText />
      </div>
    );
  }

  changeFilter = type => {
    const { changeFilter, onSearchBoxFocus } = this.props;
    changeFilter(type);
    onSearchBoxFocus();
  };

  setDefaultSearchFilter = () => {
    const { setDefaultSearchFilter, onSearchBoxFocus } = this.props;
    setDefaultSearchFilter();
    onSearchBoxFocus();
  };
}
