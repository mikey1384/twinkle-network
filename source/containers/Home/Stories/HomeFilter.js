import React, { Component } from 'react';
import DropdownButton from 'components/Buttons/DropdownButton';
import { Color } from 'constants/css';
import { PropTypes } from 'prop-types';
import Switch from 'components/Switch';
import FilterBar from 'components/FilterBar';
import { connect } from 'react-redux';

class HomeFilter extends Component {
  static propTypes = {
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

  state = {
    activeTab: 'uploads'
  };

  categoryObj = {
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
      label: 'Top Responses'
    },
    videos: {
      label: 'Starred Videos'
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState({ activeTab: this.props.category });
    }
  }

  render() {
    const {
      applyFilter,
      category,
      changeCategory,
      displayOrder,
      hideWatched,
      selectedFilter,
      setDisplayOrder,
      toggleHideWatched,
      userId
    } = this.props;
    const { activeTab } = this.state;
    return (
      <>
        <FilterBar
          bordered
          style={{
            height: '5.5rem',
            fontSize: '1.6rem'
          }}
        >
          {['uploads', 'responses', 'challenges', 'videos'].map(elem => (
            <nav
              key={elem}
              className={activeTab === elem ? 'active' : ''}
              onClick={() => changeCategory(elem)}
            >
              {this.categoryObj[elem].label}
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
                      text={this.categoryObj[category][displayOrder]}
                      menuProps={[
                        {
                          label:
                            displayOrder === 'desc'
                              ? this.categoryObj[category]['asc']
                              : this.categoryObj[category]['desc'],
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
                      text={this.categoryObj[category][displayOrder]}
                      style={{
                        marginLeft: category === 'uploads' && '1rem'
                      }}
                      menuProps={[
                        {
                          label:
                            displayOrder === 'desc'
                              ? this.categoryObj[category]['asc']
                              : this.categoryObj[category]['desc'],
                          onClick: setDisplayOrder
                        }
                      ]}
                    />
                  )}
                  {category === 'videos' && userId && (
                    <Switch
                      color={Color.green()}
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
      </>
    );
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(HomeFilter);
