import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AddLinkModal from './AddLinkModal'
import Button from 'components/Button'
import SectionPanel from 'components/SectionPanel'
import LinkGroup from './LinkGroup'
import Notification from 'components/Notification'
import { connect } from 'react-redux'
import { fetchLinks, fetchMoreLinks } from 'redux/actions/LinkActions'
import { container } from './Styles'

class Main extends Component {
  static propTypes = {
    fetchLinks: PropTypes.func.isRequired,
    fetchMoreLinks: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    links: PropTypes.array.isRequired,
    loadMoreLinksButtonShown: PropTypes.bool.isRequired
  }

  constructor(props) {
    super()
    this.state = {
      addLinkModalShown: false,
      loaded: !!props.links.length
    }
    this.loadMoreLinks = this.loadMoreLinks.bind(this)
  }

  componentDidMount() {
    const { fetchLinks, history } = this.props
    const { loaded } = this.state
    this.mounted = true
    if (!loaded || history.action === 'PUSH') {
      fetchLinks().then(() => {
        if (this.mounted) this.setState({ loaded: true })
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { links, loadMoreLinksButtonShown } = this.props
    const { addLinkModalShown, loaded } = this.state
    return (
      <div className={container}>
        <div className="left">
          <SectionPanel
            title="All Links"
            button={
              <Button
                snow
                onClick={() => this.setState({ addLinkModalShown: true })}
              >
                + Add Link
              </Button>
            }
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
        {addLinkModalShown && (
          <AddLinkModal
            onHide={() => this.setState({ addLinkModalShown: false })}
          />
        )}
        <Notification className="right" />
      </div>
    )
  }

  loadMoreLinks() {
    const { fetchMoreLinks, links } = this.props
    const lastId = links[links.length - 1].id
    return fetchMoreLinks(lastId)
  }
}

export default connect(
  state => ({
    links: state.LinkReducer.links,
    loadMoreLinksButtonShown: state.LinkReducer.loadMoreLinksButtonShown,
    notificationLoaded: state.NotiReducer.loaded
  }),
  {
    fetchLinks,
    fetchMoreLinks
  }
)(Main)
