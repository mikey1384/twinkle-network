import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import FilterBar from 'components/FilterBar';
import About from './About';
import Posts from './Posts';
import SideMenu from './SideMenu';
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
      id: PropTypes.number.isRequired,
      statusColor: PropTypes.string.isRequired
    })
  };

  AboutObject = {};

  state = {
    currentTab: 'about'
  };

  render() {
    const {
      location,
      match,
      match: {
        params: { username }
      },
      profile
    } = this.props;
    const { currentTab } = this.state;
    return (
      <div
        ref={ref => {
          this.Container = ref;
        }}
        style={{ height: '100%', marginBottom: '1rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              width: '55rem',
              background: '#fff',
              marginBottom: '1rem',
              borderBottom: `1px solid ${Color.borderGray()}`
            }}
          />
          <FilterBar>
            <nav
              className={currentTab === 'about' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ currentTab: 'about' })}
            >
              <a>About {capitalize(username)}</a>
            </nav>
            <nav
              className={currentTab === 'posts' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ currentTab: 'posts' })}
            >
              <a>Posts</a>
            </nav>
          </FilterBar>
          <div
            style={{
              width: '35rem',
              background: '#fff',
              marginBottom: '1rem',
              borderBottom: `1px solid ${Color.borderGray()}`
            }}
          />
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <div
            style={{
              display: 'flex',
              margin: '0 1rem',
              width: '80vw',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: 'CALC(100% - 30rem)' }}>
              {currentTab === 'about' ? (
                <About profile={profile} />
              ) : (
                <Posts username={username} location={location} match={match} />
              )}
            </div>
            <SideMenu
              menuItems={
                currentTab === 'about'
                  ? [
                      { key: 'info', label: 'Basic Info' },
                      { key: 'diary', label: 'Diary' }
                    ]
                  : [
                      { key: 'all', label: 'All' },
                      { key: 'post', label: 'Posts' },
                      { key: 'comment', label: 'Comments' },
                      { key: 'video', label: 'Videos' },
                      { key: 'url', label: 'Links' }
                    ]
              }
              onMenuClick={this.onClickPostsMenu}
              style={{ width: '30rem' }}
            />
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
  };
}

export default connect(
  null,
  { clearFeeds, disableAutoscroll }
)(Body);
