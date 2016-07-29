import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {Modal, Button} from 'react-bootstrap';
import {
  closeAddPlaylistModal,
  uploadPlaylistAsync,
  getMoreVideosForModalAsync
} from 'redux/actions/PlaylistActions';
import {stringIsEmpty} from 'helpers/stringHelpers';
import {connect} from 'react-redux';
import SortableThumb from './SortableThumb';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SelectVideosForm from './SelectVideosForm';

const defaultState = {
  section: 0,
  title: '',
  description: '',
  selectedVideos: [],
  titleError: false
}

@DragDropContext(HTML5Backend)
@connect(
  state => ({
    videos: state.PlaylistReducer.videoThumbsForModal,
    loadMoreVideosButton: state.PlaylistReducer.loadMoreButtonForModal
  }),
  {
    closeAddPlaylistModal,
    uploadPlaylist: uploadPlaylistAsync,
    getMoreVideosForModal: getMoreVideosForModalAsync
  }
)
export default class AddPlaylistModal extends Component {
  constructor() {
    super()
    this.state = defaultState;
    this.handleHide = this.handleHide.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
  }

  render() {
    const {videos, loadMoreVideosButton, getMoreVideosForModal} = this.props;
    const {section, titleError, title, description} = this.state;
    const last = array => {
      return array[array.length - 1];
    };
    const lastId = last(videos) ? last(videos).id : 0;
    const loadMoreVideos = () => {
      getMoreVideosForModal(lastId);
    }
    return (
      <Modal
        show
        animation={false}
        backdrop="static"
        onHide={this.handleHide}
        dialogClassName={section >= 1 ? "modal-extra-lg" : ""}
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
                <label>Playlist Title</label>
                <input
                  name="title"
                  placeholder="Enter Playlist Title"
                  className="form-control"
                  type="text"
                  value={title}
                  onChange={e => this.setState({title: e.target.value})}
                />
                <span
                  className="help-block"
                  style={{color: 'red'}}
                >{titleError && "Enter title"}</span>
              </fieldset>
              <fieldset className="form-group">
                <label>Description</label>
                <Textarea
                  name="description"
                  placeholder="Enter Description (Optional)"
                  className="form-control"
                  minRows={4}
                  value={description}
                  onChange={e => this.setState({description: e.target.value})}
                />
              </fieldset>
            </form>
          }
          {section === 1 &&
            <SelectVideosForm
              videos={videos}
              selectedVideos={this.state.selectedVideos}
              loadMoreVideosButton={loadMoreVideosButton}
              onSelect={(selected, videoId) => this.setState({
                selectedVideos: selected.concat([videoId])
              })}
              onDeselect={selected => this.setState({selectedVideos: selected})}
              loadMoreVideos={loadMoreVideos}
            />
          }
          {section === 2 &&
            <div className="row">
              {this.state.selectedVideos.map(videoId => {
                let index = -1;
                for(let i = 0; i < videos.length; i++) {
                  if (videos[i].id === videoId) {
                    index = i;
                    break;
                  }
                }
                return (
                  <SortableThumb
                    key={videos[index].id}
                    video={videos[index]}
                    onMove={({sourceId, targetId}) => {
                      const selectedVideoArray = this.state.selectedVideos;
                      const sourceIndex = selectedVideoArray.indexOf(sourceId);
                      const targetIndex = selectedVideoArray.indexOf(targetId);
                      selectedVideoArray.splice(sourceIndex, 1);
                      selectedVideoArray.splice(targetIndex, 0, sourceId);
                      this.setState({
                        selectedVideos: selectedVideoArray
                      });
                    }}
                  />
                )
              })}
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          {section === 0 ?
            <Button onClick={this.handleHide}>Cancel</Button>
            :
            <Button onClick={this.handlePrev}>Prev</Button>
          }
          {section === 2 ?
            <Button bsStyle="primary" onClick={this.handleFinish}>Finish</Button>
            :
            <Button
              bsStyle="primary"
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
    const currentSection = this.state.section;
    switch(currentSection) {
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
    const currentSection = this.state.section;
    const prevSection = Math.max(currentSection - 1, 0);
    this.setState({section: prevSection});
  }

  handleNext() {
    const currentSection = this.state.section;
    const {title} = this.state;
    if (currentSection === 0 && stringIsEmpty(title)) return this.setState({titleError: true});
    const nextSection = Math.min(currentSection + 1, 2);
    this.setState({section: nextSection});
  }

  handleFinish() {
    const {uploadPlaylist, subscribe} = this.props;
    const {title, description, selectedVideos} = this.state;
    uploadPlaylist({title, description, selectedVideos});
  }

  handleHide() {
    const {closeAddPlaylistModal} = this.props;
    this.setState(defaultState);
    closeAddPlaylistModal();
  }
}
