import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import SwitchButton from 'components/SwitchButton';
import FilterBar from 'components/FilterBar';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { css } from 'emotion';

const categoryObj = {
  uploads: {
    label: 'Posts',
    desc: 'New to Old',
    asc: 'Old to New'
  },
  challenges: {
    label: 'Challenges',
    desc: 'Hard to Easy',
    asc: 'Easy to Hard'
  },
  responses: {
    label: 'Top Comments'
  },
  videos: {
    label: 'Starred Videos'
  }
};

HomeFilter.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  displayOrder: PropTypes.string.isRequired,
  hideWatched: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  profileTheme: PropTypes.string,
  setDisplayOrder: PropTypes.func.isRequired,
  selectedFilter: PropTypes.string.isRequired,
  userId: PropTypes.number,
  toggleHideWatched: PropTypes.func.isRequired
};

export default function HomeFilter({
  applyFilter,
  category,
  changeCategory,
  displayOrder,
  hideWatched,
  profileTheme,
  selectedFilter,
  setDisplayOrder,
  toggleHideWatched,
  userId
}) {
  const [activeTab, setActiveTab] = useState();
  useEffect(() => setActiveTab(category), [category]);
  return (
    <ErrorBoundary>
      <FilterBar
        inverted
        bordered
        className={css`
          position: -webkit-sticky;
        `}
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 1000,
          height: '3rem',
          fontSize: '1.6rem'
        }}
      >
        {['uploads', 'responses', 'challenges', 'videos'].map(elem => (
          <nav
            key={elem}
            className={activeTab === elem ? 'active' : ''}
            onClick={() => {
              document.getElementById('App').scrollTop = 0;
              changeCategory(elem);
            }}
          >
            {categoryObj[elem].label}
          </nav>
        ))}
      </FilterBar>
      {(activeTab === 'uploads' ||
        activeTab === 'challenges' ||
        (category === 'videos' && userId)) && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {category === 'uploads' && (
              <FilterBar
                bordered
                style={{
                  height: '5rem',
                  fontSize: '1.6rem',
                  marginBottom: 0
                }}
                dropdownButton={
                  <DropdownButton
                    snow
                    direction="left"
                    icon="caret-down"
                    text={categoryObj[category][displayOrder]}
                    menuProps={[
                      {
                        label:
                          displayOrder === 'desc'
                            ? categoryObj[category]['asc']
                            : categoryObj[category]['desc'],
                        onClick: setDisplayOrder
                      }
                    ]}
                  />
                }
              >
                {['all', 'post'].map(type => {
                  const displayLabel =
                    type === 'all' ? 'All Posts' : 'Subjects';
                  return (
                    <nav
                      key={type}
                      className={selectedFilter === type ? 'active' : ''}
                      onClick={() => applyFilter(type)}
                    >
                      {`${displayLabel
                        .charAt(0)
                        .toUpperCase()}${displayLabel.slice(1)}`}
                    </nav>
                  );
                })}
              </FilterBar>
            )}
            {(category === 'challenges' || category === 'videos') && (
              <div
                style={{
                  display: 'flex',
                  background: '#fff',
                  height: '100%',
                  width: '100%',
                  padding: '1rem',
                  justifyContent: 'flex-end'
                }}
              >
                {category === 'challenges' && (
                  <DropdownButton
                    snow
                    direction="left"
                    icon="caret-down"
                    text={categoryObj[category][displayOrder]}
                    style={{
                      marginLeft: category === 'uploads' && '1rem'
                    }}
                    menuProps={[
                      {
                        label:
                          displayOrder === 'desc'
                            ? categoryObj[category]['asc']
                            : categoryObj[category]['desc'],
                        onClick: setDisplayOrder
                      }
                    ]}
                  />
                )}
                {category === 'videos' && userId && (
                  <SwitchButton
                    checked={!!hideWatched}
                    label="Hide Watched"
                    onChange={toggleHideWatched}
                  />
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </ErrorBoundary>
  );
}
