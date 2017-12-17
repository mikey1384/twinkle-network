import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import Button from 'components/Button'
import { connect } from 'react-redux'
import { changePlaylistVideosAsync } from 'redux/actions/PlaylistActions'
import Loading from 'components/Loading'
import SelectVideosForm from './SelectVideosForm'
import SortableThumb from './SortableThumb'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import request from 'axios'
import { URL } from 'constants/URL'
import SearchInput from 'components/Texts/SearchInput'

class EditPlaylistModal extends Component {
  static propTypes = {
    changePlaylistVideos: PropTypes.func.isRequired,
    modalType: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    playlistId: PropTypes.number.isRequired
  }

  timer = null

  state = {
    allVideos: [],
    loaded: false,
    searchedVideos: [],
    selectedVideos: [],
    loadMoreButtonShown: false,
    mainTabActive: true,
    searchText: ''
  }

  componentWillMount() {
    const { modalType, playlistId } = this.props
    return Promise.all([
      request.get(
        `${URL}/playlist/playlist?noLimit=1&playlistId=${playlistId}`
      ),
      modalType === 'change'
        ? request.get(`${URL}/video?numberToLoad=18`)
        : Promise.resolve({ data: [] })
    ])
      .then(([{ data: selectedVideos }, { data: allVideos }]) => {
        let loadMoreButtonShown = false
        if (allVideos.length > 18) {
          allVideos.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          selectedVideos,
          allVideos,
          loadMoreButtonShown,
          loaded: true
        })
      })
      .catch(error => console.error(error.response || error))
  }

  render() {
    const { modalType, onHide } = this.props
    const {
      selectedVideos,
      mainTabActive,
      searchText,
      loaded,
      loadMoreButtonShown,
      searchedVideos,
      allVideos
    } = this.state
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
        backdrop="static"
        dialogClassName="modal-extra-lg"
      >
        <Modal.Header closeButton>
          {modalType === 'change' ? (
            <h4>Change Playlist Videos</h4>
          ) : (
            <h4>Reorder Videos</h4>
          )}
        </Modal.Header>
        <Modal.Body>
          <ul
            className="nav nav-tabs nav-justified"
            style={{ marginBottom: '2em' }}
          >
            <li
              className={mainTabActive ? 'active' : ''}
              onClick={() => this.setState({ mainTabActive: true })}
              style={{ cursor: 'pointer' }}
            >
              <a style={{ fontWeight: 'bold' }}>
                {modalType === 'change' ? 'Add Videos' : 'Reorder Videos'}
              </a>
            </li>
            <li
              className={mainTabActive ? '' : 'active'}
              onClick={() => this.setState({ mainTabActive: false })}
              style={{ cursor: 'pointer' }}
            >
              <a style={{ fontWeight: 'bold' }}>Remove Videos</a>
            </li>
          </ul>
          {mainTabActive &&
            modalType === 'change' && (
              <SearchInput
                className="form-control"
                placeholder="Search videos..."
                autoFocus
                style={{
                  marginBottom: '2em',
                  width: '50%'
                }}
                value={searchText}
                onChange={this.onVideoSearchInput}
              />
            )}
          {!loaded && <Loading />}
          {mainTabActive &&
            modalType === 'change' && (
              <SelectVideosForm
                videos={searchText ? searchedVideos : allVideos}
                selectedVideos={selectedVideos}
                loadMoreVideosButton={searchText ? false : loadMoreButtonShown}
                onSelect={(selected, video) =>
                  this.setState({ selectedVideos: [video].concat(selected) })
                }
                onDeselect={selected =>
                  this.setState({ selectedVideos: selected })
                }
                loadMoreVideos={this.loadMoreVideos}
              />
            )}
          {mainTabActive &&
            modalType === 'reorder' && (
              <div className="row">
                {selectedVideos.map(video => (
                  <SortableThumb
                    key={video.id}
                    video={video}
                    onMove={({ sourceId, targetId }) => {
                      let selected = [...selectedVideos]
                      const selectedVideoArray = selected.map(video => video.id)
                      const sourceIndex = selectedVideoArray.indexOf(sourceId)
                      const sourceVideo = selected[sourceIndex]
                      const targetIndex = selectedVideoArray.indexOf(targetId)
                      selected.splice(sourceIndex, 1)
                      selected.splice(targetIndex, 0, sourceVideo)
                      this.setState({
                        selectedVideos: selected
                      })
                    }}
                  />
                ))}
              </div>
            )}
          {!mainTabActive && (
            <SelectVideosForm
              videos={selectedVideos}
              selectedVideos={selectedVideos}
              onSelect={(selected, video) =>
                this.setState({ selectedVideos: selected.concat([video]) })
              }
              onDeselect={selected =>
                this.setState({ selectedVideos: selected })
              }
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={onHide}>
            Cancel
          </Button>
          <Button
            className="btn btn-primary"
            onClick={this.handleSave}
            disabled={selectedVideos.length < 2}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleSave = () => {
    const { selectedVideos } = this.state
    const { playlistId, changePlaylistVideos } = this.props
    changePlaylistVideos(
      playlistId,
      selectedVideos.map(video => video.id),
      this
    )
  }

  loadMoreVideos = () => {
    const { allVideos } = this.state
    request
      .get(
        `${URL}/video?numberToLoad=18&videoId=${
          allVideos[allVideos.length - 1].id
        }`
      )
      .then(({ data: videos }) => {
        let loadMoreButtonShown = false
        if (videos.length > 18) {
          videos.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          allVideos: allVideos.concat(videos),
          loadMoreButtonShown
        })
      })
      .catch(error => console.error(error.response || error))
  }

  onVideoSearchInput = text => {
    clearTimeout(this.timer)
    this.setState({ searchText: text })
    this.timer = setTimeout(() => this.searchVideo(text), 300)
  }

  searchVideo = async text => {
    try {
      const { data: searchedVideos } = await request.get(
        `${URL}/playlist/search/video?query=${text}`
      )
      this.setState({ searchedVideos })
    } catch (error) {
      console.error(error.response || error)
    }
  }
}

export default connect(null, {
  changePlaylistVideos: changePlaylistVideosAsync
})(DragDropContext(HTML5Backend)(EditPlaylistModal))
