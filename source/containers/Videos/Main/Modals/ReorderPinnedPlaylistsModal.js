import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import SortableListGroup from 'components/SortableListGroup'
import {connect} from 'react-redux'
import {changePinnedPlaylists} from 'redux/actions/PlaylistActions'

@connect(
  null,
  {changePinnedPlaylists}
)
export default class ReorderPinnedPlaylistsModal extends Component {
  static propTypes = {
    pinnedPlaylists: PropTypes.array.isRequired,
    playlistIds: PropTypes.array.isRequired,
    onHide: PropTypes.func.isRequired,
    changePinnedPlaylists: PropTypes.func
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
    const {playlists, playlistIds} = this.state
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
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>Reorder Pinned Playlists</h4>
        </Modal.Header>
        <Modal.Body>
          <SortableListGroup
            listItems={listItems}
            onMove={this.onMove}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={this.props.onHide}>Cancel</Button>
          <Button
            className="btn btn-primary"
            onClick={this.onSubmit}
          >Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onMove({sourceId, targetId}) {
    const {playlistIds} = this.state
    const sourceIndex = playlistIds.indexOf(sourceId)
    const targetIndex = playlistIds.indexOf(targetId)
    playlistIds.splice(sourceIndex, 1)
    playlistIds.splice(targetIndex, 0, sourceId)
    this.setState({
      playlistIds
    })
  }

  onSubmit() {
    const {changePinnedPlaylists, onHide} = this.props
    const {playlistIds} = this.state
    return changePinnedPlaylists(playlistIds).then(
      () => onHide()
    )
  }
}
