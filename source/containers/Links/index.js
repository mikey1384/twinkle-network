import React, {Component, PropTypes} from 'react'
import SectionPanel from 'components/SectionPanel'
import LinkGroup from './LinkGroup'
import {connect} from 'react-redux'
import {fetchLinks, fetchMoreLinks} from 'redux/actions/LinkActions'

@connect(
  state => ({
    links: state.LinkReducer.links,
    loadMoreLinksButtonShown: state.LinkReducer.loadMoreLinksButtonShown
  }),
  {
    fetchLinks,
    fetchMoreLinks
  }
)
export default class Links extends Component {
  static propTypes = {
    links: PropTypes.array,
    fetchLinks: PropTypes.func,
    fetchMoreLinks: PropTypes.func,
    loadMoreLinksButtonShown: PropTypes.bool
  }
  constructor() {
    super()
    this.state = {
      loaded: false
    }
    this.loadMoreLinks = this.loadMoreLinks.bind(this)
  }
  componentDidMount() {
    const {fetchLinks} = this.props
    const {loaded} = this.state
    if (!loaded) {
      fetchLinks().then(
        () => this.setState({loaded: true})
      )
    }
  }
  render() {
    const {links, loadMoreLinksButtonShown} = this.props
    const {loaded} = this.state
    return (
      <div className="container-fluid">
        <SectionPanel
          title="All Links"
          emptyMessage="No Uploaded Links"
          isEmpty={links.length === 0}
          emptypMessage="No Links"
          loaded={loaded}
          loadMore={this.loadMoreLinks}
          loadMoreButtonShown={loadMoreLinksButtonShown}
        >
          <LinkGroup links={links} />
        </SectionPanel>
      </div>
    )
  }

  loadMoreLinks() {
    const {fetchMoreLinks, links} = this.props
    const lastId = links[links.length - 1].id
    return fetchMoreLinks(lastId)
  }
}
