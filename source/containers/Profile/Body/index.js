import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import FilterBar from 'components/FilterBar';
import BasicInfo from './BasicInfo';
import Achievements from './Achievements';
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

  state = {
    currentTab: 'profile',
    selectedSection: 'info'
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
    const { currentTab, selectedSection } = this.state;
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
              className={currentTab === 'profile' ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                this.setState({
                  currentTab: 'profile',
                  selectedSection: 'info'
                })
              }
            >
              <a>{`${capitalize(username)}'s Profile`}</a>
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
              {currentTab === 'profile' ? (
                selectedSection === 'info' ? (
                  <BasicInfo profile={profile} />
                ) : (
                  <Achievements />
                )
              ) : (
                <Posts username={username} location={location} match={match} />
              )}
            </div>
            <SideMenu
              menuItems={
                currentTab === 'profile'
                  ? [
                      { key: 'info', label: 'Basic Info' },
                      { key: 'achievements', label: 'Achievements' }
                    ]
                  : [
                      { key: 'all', label: 'All' },
                      { key: 'post', label: 'Posts' },
                      { key: 'comment', label: 'Comments' },
                      { key: 'video', label: 'Videos' },
                      { key: 'url', label: 'Links' }
                    ]
              }
              onMenuClick={
                currentTab === 'posts'
                  ? this.onClickPostsMenu
                  : this.onClickProfileMenu
              }
              selectedKey={selectedSection}
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
    this.setState({ selectedSection: item });
  };

  onClickProfileMenu = ({ item }) => {
    this.setState({ selectedSection: item });
  };
}

export default connect(
  null,
  { clearFeeds, disableAutoscroll }
)(Body);
