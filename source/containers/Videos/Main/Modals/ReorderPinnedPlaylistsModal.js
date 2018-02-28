import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import SortableListGroup from 'components/SortableListGroup'
import { connect } from 'react-redux'
import { changePinnedPlaylists } from 'redux/actions/PlaylistActions'

class ReorderPinnedPlaylistsModal extends Component {
  static propTypes = {
    pinnedPlaylists: PropTypes.array.isRequired,
    playlistIds: PropTypes.array.isRequired,
    onHide: PropTypes.func.isRequired,
    changePinnedPlaylists: PropTypes.func.isRequired
  }

  constructor(props) {
    super()
    this.state = {
      playlists: props.pinnedPlaylists,
      playlistIds: props.playlistIds
    }
    this.onMove = this.onMove.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { playlists, playlistIds } = this.state
    const listItems = playlistIds.reduce((result, playlistId) => {
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === playlistId) {
          result.push({
            label: playlists[i].title,
            id: playlistId
          })
        }
      }
      return result
    }, [])

    return (
      <Modal onHide={this.props.onHide}>
        <div className="modal-heading">Reorder Pinned Playlists</div>
        <div className="modal-body">
          <SortableListGroup listItems={listItems} onMove={this.onMove} />
        </div>
        <div className="modal-footer">
          <Button className="btn btn-default" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button className="btn btn-primary" onClick={this.onSubmit}>
            Done
          </Button>
        </div>
      </Modal>
    )
  }

  onMove({ sourceId, targetId }) {
    const { playlistIds } = this.state
    const sourceIndex = playlistIds.indexOf(sourceId)
    const targetIndex = playlistIds.indexOf(targetId)
    playlistIds.splice(sourceIndex, 1)
    playlistIds.splice(targetIndex, 0, sourceId)
    this.setState({
      playlistIds
    })
  }

  onSubmit() {
    const { changePinnedPlaylists, onHide } = this.props
    const { playlistIds } = this.state
    return changePinnedPlaylists(playlistIds).then(() => onHide())
  }
}

export default connect(null, { changePinnedPlaylists })(
  ReorderPinnedPlaylistsModal
)
