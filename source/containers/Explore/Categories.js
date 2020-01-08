import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Categories.propTypes = {
  filter: PropTypes.string.isRequired,
  onSetDefaultSearchFilter: PropTypes.func,
  style: PropTypes.object
};

export default function Categories({
  filter,
  onSetDefaultSearchFilter,
  style
}) {
  const {
    user: {
      actions: { onChangeDefaultSearchFilter }
    },
    requestHelpers: { setDefaultSearchFilter }
  } = useAppContext();
  const { defaultSearchFilter, profileTheme } = useMyState();
  const [changingDefaultFilter, setChangingDefaultFilter] = useState(false);

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
              > svg {
                font-size: 3.2rem;
              }
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
            transition: color 0.1s;
            &:hover {
              text-decoration: none;
              color: ${Color[profileTheme]()};
            }
          }
        `}
      >
        {['subjects', 'videos', 'links'].map(contentType =>
          filter === contentType ? (
            <nav key={contentType}>
              <p style={{ display: 'flex', alignItems: 'center' }}>
                {returnIcon(contentType)}Explore {contentType}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  opacity: changingDefaultFilter ? 0.5 : 1
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                    checked={filter === defaultSearchFilter}
                    onClick={handleSetDefaultSearchFilter}
                  />
                  {changingDefaultFilter && (
                    <Icon
                      style={{ marginLeft: '0.5rem' }}
                      icon="spinner"
                      pulse
                    />
                  )}
                </div>
              </div>
            </nav>
          ) : (
            <Link
              style={{ display: 'flex', alignItems: 'center' }}
              key={contentType}
              to={contentType}
            >
              {returnIcon(contentType)}Explore {contentType}
            </Link>
          )
        )}
      </div>
    </div>
  );

  function returnIcon(contentType) {
    let icon = '';
    if (contentType === 'subjects') {
      icon = 'bolt';
    }
    if (contentType === 'videos') {
      icon = 'film';
    }
    if (contentType === 'links') {
      icon = 'book';
    }
    return <Icon style={{ marginRight: '1.5rem' }} icon={icon} />;
  }

  async function handleSetDefaultSearchFilter() {
    if (filter === defaultSearchFilter) return;
    onChangeDefaultSearchFilter(filter);
    setChangingDefaultFilter(true);
    await setDefaultSearchFilter(filter);
    setChangingDefaultFilter(false);
    onSetDefaultSearchFilter?.();
  }
}
