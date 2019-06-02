import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { recordUserAction } from 'helpers/userDataHelpers';

export default function withScroll(WrappedComponent) {
  return class ScrollContainer extends Component {
    static propTypes = {
      chatMode: PropTypes.bool.isRequired,
      history: PropTypes.object,
      location: PropTypes.object,
      loggedIn: PropTypes.bool.isRequired,
      searchMode: PropTypes.bool.isRequired
    };

    state = {
      scrollPosition: 0,
      navScrollPositions: []
    };

    body =
      typeof document !== 'undefined'
        ? document.scrollingElement || document.documentElement
        : {};

    getSnapshotBeforeUpdate(prevProps) {
      if (
        (!this.props.searchMode &&
          !prevProps.chatMode &&
          this.props.chatMode) ||
        (!prevProps.searchMode && this.props.searchMode)
      ) {
        return {
          scrollPosition: this.body.scrollTop
        };
      }
      if (prevProps.location.pathname !== this.props.location.pathname) {
        return {
          navScrollPosition: {
            [prevProps.location.pathname]: document.getElementById('App')
              .scrollTop
          }
        };
      }
      return {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      const { history, location, loggedIn } = this.props;
      const { navScrollPositions, scrollPosition } = this.state;
      if (
        snapshot.navScrollPosition &&
        prevProps.location.pathname !== location.pathname
      ) {
        this.setState(state => ({
          navScrollPositions: {
            ...state.navScrollPositions,
            ...snapshot.navScrollPosition
          }
        }));
      }

      if (snapshot.scrollPosition) {
        this.setState(state => ({
          scrollPosition: snapshot.scrollPosition
        }));
      }

      if (
        (prevProps.searchMode && !this.props.searchMode) ||
        (prevProps.chatMode && !this.props.chatMode)
      ) {
        if (location !== prevProps.location) {
          this.setState({ scrollPosition: 0 });
        } else {
          this.body.scrollTop = scrollPosition;
        }
      }

      if (location.pathname !== prevProps.location.pathname) {
        if (history.action === 'PUSH') {
          if (loggedIn) {
            recordUserAction({
              action: 'navigation',
              target: location.pathname
            });
          }
          this.body.scrollTop = 0;
          document.getElementById('App').scrollTop = 0;
        } else {
          setTimeout(
            () =>
              (document.getElementById('App').scrollTop =
                navScrollPositions[location.pathname]),
            0
          );
        }
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
