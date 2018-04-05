import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { uploadPlaylist } from 'redux/actions/PlaylistActions'
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers'
import { connect } from 'react-redux'
import SortableThumb from './SortableThumb'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import SelectVideosForm from './SelectVideosForm'
import request from 'axios'
import { URL } from 'constants/URL'
import Input from 'components/Texts/Input'
import SearchInput from 'components/Texts/SearchInput'
import { css } from 'emotion'

class AddPlaylistModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    uploadPlaylist: PropTypes.func
  }

  timer = null

  state = {
    isUploading: false,
    section: 0,
    title: '',
    description: '',
    allVideos: [],
    searchedVideos: [],
    selectedVideos: [],
    loadMoreButtonShown: false,
    searchText: ''
  }

  componentDidMount() {
    return request
      .get(`${URL}/video?numberToLoad=18`)
      .then(({ data: allVideos }) => {
        let loadMoreButtonShown = false
        if (allVideos.length > 18) {
          allVideos.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          allVideos,
          loadMoreButtonShown
        })
      })
      .catch(error => console.error(error.response || error))
  }

  render() {
    const { onHide } = this.props
    const {
      isUploading,
      section,
      title,
      description,
      loadMoreButtonShown,
      allVideos,
      searchedVideos,
      selectedVideos,
      searchText
    } = this.state
    return (
      <Modal
        onHide={onHide}
        className={css`
          .left-button {
            margin-right: 1rem;
          }
        `}
        large={section > 0}
      >
        <header>{this.renderTitle()}</header>
        <main style={{ paddingBottom: '1rem' }}>
          {section === 0 && (
            <form
              className={css`
                width: 100%;
              `}
              onSubmit={event => event.preventDefault()}
            >
              <section>
                <Input
                  className="form-control"
                  placeholder="Enter Playlist Title"
                  value={title}
                  onChange={text => this.setState({ title: text })}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({ title: addEmoji(event.target.value) })
                    }
                  }}
                />
              </section>
              <section style={{ marginTop: '1.5rem' }}>
                <Textarea
                  name="description"
                  placeholder="Enter Description (Optional)"
                  minRows={4}
                  value={description}
                  onChange={event =>
                    this.setState({ description: event.target.value })
                  }
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        description: addEmoji(event.target.value)
                      })
                    }
                  }}
                />
              </section>
            </form>
          )}
          {section === 1 && (
            <div style={{ width: '100%' }}>
              <SearchInput
                placeholder="Search videos..."
                autoFocus
                style={{
                  marginBottom: '2em',
                  width: '50%'
                }}
                value={searchText}
                onChange={this.onVideoSearchInput}
              />
              <SelectVideosForm
                videos={searchText ? searchedVideos : allVideos}
                selectedVideos={selectedVideos}
                loadMoreVideosButton={searchText ? false : loadMoreButtonShown}
                onSelect={(selected, video) =>
                  this.setState({
                    selectedVideos: selected.concat([video])
                  })
                }
                onDeselect={selected =>
                  this.setState({ selectedVideos: selected })
                }
                loadMoreVideos={this.loadMoreVideos}
              />
            </div>
          )}
          {section === 2 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                width: '100%'
              }}
            >
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
        </main>
        <footer>
          {section === 2 ? (
            <Button primary disabled={isUploading} onClick={this.handleFinish}>
              Finish
            </Button>
          ) : (
            <Button
              primary
              type="submit"
              disabled={
                (section === 0 && stringIsEmpty(title)) ||
                (section === 1 && this.state.selectedVideos.length < 2)
              }
              onClick={this.handleNext}
            >
              Next
            </Button>
          )}
          {section === 0 ? (
            <Button className="left-button" transparent onClick={onHide}>
              Cancel
            </Button>
          ) : (
            <Button
              className="left-button"
              transparent
              onClick={this.handlePrev}
            >
              Prev
            </Button>
          )}
        </footer>
      </Modal>
    )
  }

  renderTitle = () => {
    const currentSection = this.state.section
    switch (currentSection) {
      case 0:
        return 'Add Playlist'
      case 1:
        return 'Add videos to your playlist'
      case 2:
        return 'Click and drag videos into the order that you would like them to appear'
      default:
        return 'Error'
    }
  }

  handlePrev = () => {
    const currentSection = this.state.section
    const prevSection = Math.max(currentSection - 1, 0)
    this.setState({ section: prevSection })
  }

  handleNext = () => {
    const currentSection = this.state.section
    const nextSection = Math.min(currentSection + 1, 2)
    this.setState({ section: nextSection })
  }

  handleFinish = async() => {
    const { uploadPlaylist, onHide } = this.props
    const { title, description, selectedVideos } = this.state
    this.setState({ isUploading: true })
    await uploadPlaylist({
      title: finalizeEmoji(title),
      description: finalizeEmoji(description),
      selectedVideos: selectedVideos.map(video => video.id)
    })
    onHide()
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

export default connect(null, { uploadPlaylist })(
  DragDropContext(HTML5Backend)(AddPlaylistModal)
)
