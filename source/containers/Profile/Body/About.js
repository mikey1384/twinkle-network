import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';

export default class About extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };
  render() {
    const { profile } = this.props;
    return (
      <div>
        <SectionPanel
          headerColor={profile.statusColor}
          title="About"
          loaded={false}
          loadMoreButtonShown={false}
        >
          This is about section
        </SectionPanel>
      </div>
    );
  }
}
