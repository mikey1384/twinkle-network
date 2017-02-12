import React, {PropTypes} from 'react'
import Button from 'components/Button'
import Loading from 'components/Loading'

SectionPanel.propTypes = {
  title: PropTypes.string,
  button: PropTypes.node,
  emptyMessage: PropTypes.string,
  isEmpty: PropTypes.bool,
  loaded: PropTypes.bool,
  loadMore: PropTypes.func,
  children: PropTypes.node,
  loadMoreButtonShown: PropTypes.bool
}
export default function SectionPanel({
  title,
  button,
  emptyMessage,
  isEmpty,
  loaded,
  loadMore,
  children,
  loadMoreButtonShown
}) {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading flexbox-container">
        <h3 className="panel-title pull-left">{title}</h3>
        {button}
        <div className="clearfix"></div>
      </div>
      <div className="panel-body">
        {isEmpty && (loaded ? <div className="text-center">{emptyMessage}</div> : <Loading />)}
        {children}
        {loadMoreButtonShown && <div className="text-center col-sm-12">
            <Button className="btn btn-success" onClick={loadMore}>Load More</Button>
          </div>
        }
      </div>
    </div>
  )
}
