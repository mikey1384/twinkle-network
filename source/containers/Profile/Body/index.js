import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'helpers/stringHelpers';
import { Color, mobileMaxWidth } from 'constants/css';
import FilterBar from 'components/FilterBar';
import Home from './Home';
import Posts from './Posts';
import SideMenu from './SideMenu';
import { css } from 'emotion';
import { clearFeeds } from 'redux/actions/FeedActions';
import { disableAutoscroll } from 'redux/actions/ViewActions';
import { connect } from 'react-redux';

class Body extends Component {
  static propTypes = {
    disableAutoscroll: PropTypes.func.isRequired,
    clearFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    selectedTheme: PropTypes.string.isRequired
  };

  state = {
    currentTab: 'profile',
    selectedSection: 'home',
    selectedFilter: 'all'
  };

  render() {
    const {
      location,
      match,
      match: {
        params: { username }
      },
      profile,
      selectedTheme
    } = this.props;
    const { currentTab, selectedSection, selectedFilter } = this.state;
    return (
      <div
        ref={ref => {
          this.Container = ref;
        }}
        style={{ height: '100%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className={css`
              width: 55rem;
              background: #fff;
              margin-bottom: 1rem;
              border-bottom: 1px solid ${Color.borderGray()};
              @media (max-width: ${mobileMaxWidth}) {
                width: 25rem;
              }
            `}
          />
          <FilterBar
            className={css`
              @media (max-width: ${mobileMaxWidth}) {
                height: 6rem;
              }
            `}
            color={selectedTheme}
          >
            <nav
              className={currentTab === 'profile' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.setState({
                  currentTab: 'profile',
                  selectedSection: 'home'
                })
              }
            >
              <a>
                <span className="desktop">{`${capitalize(username)}'s`} </span>
                Profile
              </a>
            </nav>
            <nav
              className={currentTab === 'posts' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.setState({ currentTab: 'posts', selectedSection: 'all' })
              }
            >
              <a>Posts</a>
            </nav>
          </FilterBar>
          <div
            className={css`
              width: 35rem;
              background: #fff;
              margin-bottom: 1rem;
              border-bottom: 1px solid ${Color.borderGray()};
              @media (max-width: ${mobileMaxWidth}) {
                width: 0;
              }
            `}
          />
        </div>
        {currentTab === 'posts' && (
          <FilterBar className="mobile">
            {[
              { key: 'all', label: 'All' },
              { key: 'post', label: 'Discussions' },
              { key: 'video', label: 'Videos' },
              { key: 'url', label: 'Links' }
            ].map(type => {
              return (
                <nav
                  key={type.key}
                  className={selectedFilter === type.key ? 'active' : ''}
                  onClick={() => this.onClickPostsMenu({ item: type.key })}
                >
                  {type.label}
                </nav>
              );
            })}
          </FilterBar>
        )}
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <div
            className={css`
              display: flex;
              margin: 0 1rem;
              width: ${currentTab === 'posts' ? '80vw' : '70vw'};
              justify-content: space-between;
              @media (max-width: ${mobileMaxWidth}) {
                width: 100vw;
                margin: 0;
              }
            `}
          >
            <div
              className={css`
                width: ${currentTab === 'posts'
                  ? 'CALC(100% - 25rem)'
                  : '100%'};
                @media (max-width: ${mobileMaxWidth}) {
                  width: 100%;
                }
              `}
            >
              {currentTab === 'profile' ? (
                <Home profile={profile} selectedTheme={selectedTheme} />
              ) : (
                <Posts
                  selectedSection={selectedSection}
                  username={username}
                  location={location}
                  match={match}
                />
              )}
            </div>
            {currentTab === 'posts' && (
              <SideMenu
                className={`desktop ${css`
                  width: 30rem;
                `}`}
                menuItems={[
                  { key: 'all', label: 'All' },
                  { key: 'post', label: 'Discussions' },
                  { key: 'video', label: 'Videos' },
                  { key: 'url', label: 'Links' }
                ]}
                onMenuClick={this.onClickPostsMenu}
                selectedKey={selectedSection}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  onClickPostsMenu = ({ item }) => {
    const { clearFeeds, disableAutoscroll, history, match } = this.props;
    clearFeeds();
    disableAutoscroll();
    history.push(
      `${match.url}${
        item !== 'all' ? `/${item === 'url' ? 'link' : item}s` : ''
      }`
    );
    this.setState({ selectedFilter: item, selectedSection: item });
  };

  onClickProfileMenu = ({ item }) => {
    this.setState({ selectedSection: item });
  };
}

export default connect(
  state => ({
    myId: state.UserReducer.userId
  }),
  { clearFeeds, disableAutoscroll }
)(Body);
