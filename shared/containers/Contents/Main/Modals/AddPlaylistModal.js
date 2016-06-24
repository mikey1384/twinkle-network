import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import {reduxForm} from 'redux-form';
import {Modal, Button} from 'react-bootstrap';
import {
  closeAddPlaylistModal,
  uploadPlaylistAsync,
  getMoreVideosForModalAsync
} from 'redux/actions/PlaylistActions';
import {connect} from 'react-redux';
import SortableThumb from './SortableThumb';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SelectVideosForm from './SelectVideosForm';

const defaultState = {
  section: 0,
  title: null,
  description: null,
  selectedVideos: [],
  titleError: false
}

@reduxForm({
  form: 'UploadPlaylistForm',
  fields: ['title', 'description'],
  validate
})
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
    const {fields: {title, description}, videos, loadMoreVideosButton, getMoreVideosForModal} = this.props;
    const {section} = this.state;
    let titleError = (title.touched && title.invalid) || this.state.titleError;
    const last = array => {
      return array[array.length - 1];
    };
    const lastId = last(videos) ? last(videos).id : 0;
    const loadMoreVideos = () => {
      getMoreVideosForModal(lastId);
    }
    return (
      <Modal
        {...this.props}
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
              <div className={`form-group ${titleError ? 'has-error' : ''}`}>
                <label>Playlist Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Playlist Title"
                  {...title}
                />
                <span className="help-block">
                  {titleError ? title.error : ''}
                </span>
              </div>
              <div className="form-group">
                <label>Description</label>
                <Textarea
                  className="form-control"
                  minRows={4}
                  placeholder="Enter Description (Optional)"
                  {...description}
                />
              </div>
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
    const {fields: {title, description}} = this.props;
    if (currentSection === 0) {
      let titleError = title.invalid;
      if (titleError) {
        return this.setState({titleError: true});
      }
      this.setState({
        title: title.value || null,
        description: description.value || null
      })
    }
    const nextSection = Math.min(currentSection + 1, 2);
    this.setState({section: nextSection});
  }

  handleFinish() {
    const {uploadPlaylist, subscribe, resetForm} = this.props;
    const {title, description, selectedVideos} = this.state;
    resetForm();
    uploadPlaylist({title, description, selectedVideos});
  }

  handleHide() {
    const {closeAddPlaylistModal, resetForm} = this.props;
    resetForm();
    this.setState(defaultState);
    closeAddPlaylistModal();
  }
}

function validate(values) {
  const {title} = values;
  const errors = {};
  if ((title && containsOnlySpaces(title)) || !title) {
    errors.title = 'Enter title';
  }
  return errors;
}

function containsOnlySpaces(string) {
  return string.replace(/\s/g, "").replace(/\r?\n/g, "") === "";
}
