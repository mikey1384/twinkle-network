import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import DropdownButton from 'components/Buttons/DropdownButton';
import SwitchButton from 'components/SwitchButton';
import FilterBar from 'components/FilterBar';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

const categoryObj = {
  uploads: {
    label: 'Posts',
    desc: 'New to Old',
    asc: 'Old to New'
  },
  challenges: {
    label: 'High Reward Subjects'
  },
  videos: {
    label: 'XP Videos'
  }
};

HomeFilter.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  displayOrder: PropTypes.string.isRequired,
  hideWatched: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
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
        style={{
          height: '4rem',
          fontSize: '1.6rem'
        }}
      >
        {['uploads', 'challenges', 'videos'].map(elem => (
          <nav
            key={elem}
            className={activeTab === elem ? 'active' : ''}
            style={{ width: elem !== 'challenges' ? '70%' : '100%' }}
            onClick={() => {
              document.getElementById('App').scrollTop = 0;
              changeCategory(elem);
            }}
          >
            {categoryObj[elem].label}
          </nav>
        ))}
      </FilterBar>
      {(activeTab === 'uploads' || (category === 'videos' && userId)) && (
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
                    skeuomorphic
                    color="darkerGray"
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
                {['all', 'subject'].map(type => {
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
            {category === 'videos' && (
              <div
                className={css`
                  border: 1px solid ${Color.borderGray()};
                  @media (max-width: ${mobileMaxWidth}) {
                    border-right: 0;
                    border-left: 0;
                  }
                `}
                style={{
                  display: 'flex',
                  background: '#fff',
                  height: '100%',
                  width: '100%',
                  padding: '1rem',
                  justifyContent: 'flex-end'
                }}
              >
                {userId && (
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
