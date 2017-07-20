import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Textarea from 'react-textarea-autosize'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import {uploadPlaylistAsync} from 'redux/actions/PlaylistActions'
import {stringIsEmpty, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'
import {connect} from 'react-redux'
import SortableThumb from './SortableThumb'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-touch-backend'
import SelectVideosForm from './SelectVideosForm'
import request from 'axios'
import {URL} from 'constants/URL'
import Input from 'components/Texts/Input'
import SearchInput from 'components/Texts/SearchInput'

@DragDropContext(HTML5Backend)
@connect(
  null,
  {
    uploadPlaylist: uploadPlaylistAsync
  }
)
export default class AddPlaylistModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    uploadPlaylist: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      section: 0,
      title: '',
      description: '',
      allVideos: [],
      searchedVideos: [],
      selectedVideos: [],
      loadMoreButtonShown: false,
      titleError: false,
      searchText: ''
    }
    this.handlePrev = this.handlePrev.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
    this.loadMoreVideos = this.loadMoreVideos.bind(this)
    this.onVideoSearch = this.onVideoSearch.bind(this)
  }

  componentWillMount() {
    return request.get(`${URL}/video?numberToLoad=18`).then(
      ({data: allVideos}) => {
        let loadMoreButtonShown = false
        if (allVideos.length > 18) {
          allVideos.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          allVideos,
          loadMoreButtonShown
        })
      }
    ).catch(
      error => console.error(error.response || error)
    )
  }

  render() {
    const {onHide} = this.props
    const {
      section, titleError, title, description, loadMoreButtonShown,
      allVideos, searchedVideos, selectedVideos, searchText
    } = this.state
    return (
      <Modal
        show
        animation={false}
        backdrop="static"
        onHide={onHide}
        dialogClassName={section >= 1 ? 'modal-extra-lg' : ''}
      >
        <Modal.Header closeButton>
          {this.renderTitle()}
        </Modal.Header>

        <Modal.Body>
          {section === 0 &&
            <form
              className="container-fluid"
              onSubmit={event => event.preventDefault()}
              onChange={() => this.setState({titleError: false})}
            >
              <fieldset className="form-group">
                <label><b>Playlist Title</b></label>
                <Input
                  className="form-control"
                  placeholder="Enter Playlist Title"
                  value={title}
                  onChange={text => this.setState({title: text})}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({title: addEmoji(event.target.value)})
                    }
                  }}
                />
                <span
                  className="help-block"
                  style={{color: 'red'}}
                >{titleError && 'Enter title'}</span>
              </fieldset>
              <fieldset className="form-group">
                <label><b>Description</b></label>
                <Textarea
                  name="description"
                  placeholder="Enter Description (Optional)"
                  className="form-control"
                  minRows={4}
                  value={description}
                  onChange={event => this.setState({description: event.target.value})}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({description: addEmoji(event.target.value)})
                    }
                  }}
                />
              </fieldset>
            </form>
          }
          {section === 1 &&
            <div>
              <SearchInput
                className="form-control"
                placeholder="Search videos..."
                autoFocus
                style={{
                  marginBottom: '2em',
                  width: '50%'
                }}
                value={searchText}
                onChange={this.onVideoSearch}
              />
              <SelectVideosForm
                videos={searchText ? searchedVideos : allVideos}
                selectedVideos={selectedVideos}
                loadMoreVideosButton={searchText ? false : loadMoreButtonShown}
                onSelect={(selected, video) => this.setState({
                  selectedVideos: selected.concat([video])
                })}
                onDeselect={selected => this.setState({selectedVideos: selected})}
                loadMoreVideos={this.loadMoreVideos}
              />
            </div>
          }
          {section === 2 &&
            <div className="row">
              {selectedVideos.map(video => <SortableThumb
                key={video.id}
                video={video}
                onMove={({sourceId, targetId}) => {
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
              />)}
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          {section === 0 ?
            <Button className="btn btn-default" onClick={onHide}>Cancel</Button>
            :
            <Button className="btn btn-default" onClick={this.handlePrev}>Prev</Button>
          }
          {section === 2 ?
            <Button className="btn btn-primary" onClick={this.handleFinish}>Finish</Button>
            :
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={section === 1 && this.state.selectedVideos.length < 2}
              onClick={this.handleNext}
            >Next</Button>
          }
        </Modal.Footer>
      </Modal>
    )
  }

  renderTitle() {
    const currentSection = this.state.section
    switch (currentSection) {
      case 0:
        return <h4>Add Playlist</h4>
      case 1:
        return <h4>Add videos to your playlist</h4>
      case 2:
        return <h4>Click and drag videos into the order that you would like them to appear</h4>
      default:
        return <h4>TBD</h4>
    }
  }

  handlePrev() {
    const currentSection = this.state.section
    const prevSection = Math.max(currentSection - 1, 0)
    this.setState({section: prevSection})
  }

  handleNext() {
    const currentSection = this.state.section
    const {title} = this.state
    if (currentSection === 0 && stringIsEmpty(title)) return this.setState({titleError: true})
    const nextSection = Math.min(currentSection + 1, 2)
    this.setState({section: nextSection})
  }

  handleFinish() {
    const {uploadPlaylist, onHide} = this.props
    const {title, description, selectedVideos} = this.state
    return uploadPlaylist({
      title: finalizeEmoji(title),
      description: finalizeEmoji(description),
      selectedVideos: selectedVideos.map(video => video.id)
    }).then(
      () => onHide()
    )
  }

  loadMoreVideos() {
    const {allVideos} = this.state
    request.get(`${URL}/video?numberToLoad=18&videoId=${allVideos[allVideos.length - 1].id}`)
      .then(
        ({data: videos}) => {
          let loadMoreButtonShown = false
          if (videos.length > 18) {
            videos.pop()
            loadMoreButtonShown = true
          }
          this.setState({
            allVideos: allVideos.concat(videos),
            loadMoreButtonShown
          })
        }
      ).catch(
        error => console.error(error.response || error)
      )
  }

  onVideoSearch(text) {
    this.setState({searchText: text})
    return request.get(`${URL}/playlist/search/video?query=${text}`).then(
      ({data: searchedVideos}) => this.setState({searchedVideos})
    ).catch(
      error => console.error(error.response || error)
    )
  }
}
