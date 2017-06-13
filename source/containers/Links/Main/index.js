import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SectionPanel from 'components/SectionPanel'
import LinkGroup from './LinkGroup'
import Notification from 'containers/Notification'
import {connect} from 'react-redux'
import {fetchLinks, fetchMoreLinks} from 'redux/actions/LinkActions'

@connect(
  state => ({
    links: state.LinkReducer.links,
    loadMoreLinksButtonShown: state.LinkReducer.loadMoreLinksButtonShown,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {
    fetchLinks,
    fetchMoreLinks
  }
)
export default class Main extends Component {
  static propTypes = {
    links: PropTypes.array,
    fetchLinks: PropTypes.func,
    fetchMoreLinks: PropTypes.func,
    loadMoreLinksButtonShown: PropTypes.bool,
    notificationLoaded: PropTypes.bool,
    history: PropTypes.object
  }

  constructor(props) {
    super()
    this.state = {
      loaded: !!props.links.length
    }
    this.loadMoreLinks = this.loadMoreLinks.bind(this)
  }

  componentDidMount() {
    const {fetchLinks, history} = this.props
    const {loaded} = this.state
    if (!loaded || history.action === 'PUSH') {
      fetchLinks().then(
        () => this.setState({loaded: true})
      )
    }
  }

  render() {
    const {links, loadMoreLinksButtonShown, notificationLoaded} = this.props
    const {loaded} = this.state
    return (
      <div>
        <div className="col-md-9">
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
        {notificationLoaded && <Notification />}
      </div>
    )
  }

  loadMoreLinks() {
    const {fetchMoreLinks, links} = this.props
    const lastId = links[links.length - 1].id
    return fetchMoreLinks(lastId)
  }
}
