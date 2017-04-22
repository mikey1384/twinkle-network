import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'

export default class SectionPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    button: PropTypes.node,
    emptyMessage: PropTypes.string,
    isEmpty: PropTypes.bool,
    loaded: PropTypes.bool,
    loadMore: PropTypes.func,
    children: PropTypes.node,
    loadMoreButtonShown: PropTypes.bool
  }
  constructor() {
    super()
    this.state = {
      loading: false
    }
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  render() {
    const {
      title,
      button,
      emptyMessage,
      isEmpty,
      loaded,
      children,
      loadMoreButtonShown
    } = this.props
    const {loading} = this.state
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          {button}
          <div className="clearfix"></div>
        </div>
        <div className="panel-body">
          {loaded ?
            (isEmpty && <div className="text-center">{emptyMessage}</div>) :
            (isEmpty && <Loading />)
          }
          {children}
          {loadMoreButtonShown && <div className="text-center col-sm-12">
              <Button disabled={loading} className="btn btn-success" onClick={this.onLoadMore}>Load More</Button>
            </div>
          }
        </div>
      </div>
    )
  }

  onLoadMore() {
    const {loadMore} = this.props
    const {loading} = this.state
    if (!loading) {
      this.setState({loading: true})
      return loadMore().then(
        () => this.setState({loading: false})
      )
    }
  }
}
