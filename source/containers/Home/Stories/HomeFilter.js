import React, { Component } from 'react';
import DropdownButton from 'components/Buttons/DropdownButton';
import { borderRadius, Color } from 'constants/css';
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
      label: 'Uploads',
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
              width: '100%',
              background: '#fff',
              padding: '1rem',
              marginBottom: '1rem',
              border: `1px solid ${Color.borderGray()}`,
              borderRadius: borderRadius,
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex' }}>
              {category === 'uploads' && (
                <DropdownButton
                  snow
                  icon="caret-down"
                  text={`${selectedFilter === 'url' ? 'link' : selectedFilter}${
                    selectedFilter === 'all' ? '' : 's'
                  }`}
                  menuProps={['all', 'video', 'url', 'post', 'comment']
                    .map(type => {
                      const displayLabel = type === 'url' ? 'link' : type;
                      const s = type === 'all' ? '' : 's';
                      return {
                        key: type,
                        label: `${displayLabel
                          .charAt(0)
                          .toUpperCase()}${displayLabel.slice(1)}${s}`,
                        onClick: () => applyFilter(type)
                      };
                    })
                    .filter(prop => prop.key !== selectedFilter)}
                />
              )}
              {(category === 'uploads' || category === 'challenges') && (
                <DropdownButton
                  snow
                  icon="caret-down"
                  text={this.categoryObj[category][displayOrder]}
                  style={{ marginLeft: category === 'uploads' && '1rem' }}
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
              {category === 'videos' &&
                userId && (
                  <Switch
                    color={Color.green()}
                    checked={!!hideWatched}
                    label="Hide Watched"
                    onChange={toggleHideWatched}
                  />
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
