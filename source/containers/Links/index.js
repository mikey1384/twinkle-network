import React, {Component} from 'react'
import SectionPanel from 'components/SectionPanel'
import LinkGroup from './LinkGroup'

export default class Links extends Component {
  render() {
    return (
      <div className="container-fluid">
        <SectionPanel
          title="All Links"
          emptyMessage="No Uploaded Links"
          isEmpty={false}
          loaded={true}
          loadMore={() => console.log('Load More')}
          loadMoreButtonShown={true}
        >
          <LinkGroup />
        </SectionPanel>
      </div>
    )
  }
}
