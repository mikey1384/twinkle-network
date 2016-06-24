import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
  closeEditPlaylistModal,
  changePlaylistVideosAsync,
  getMoreVideosForModalAsync
} from 'redux/actions/PlaylistActions';
import SelectVideosForm from './SelectVideosForm';
import SortableThumb from './SortableThumb';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
@connect(
  state => ({
    modalType: state.PlaylistReducer.editPlaylistModalType,
    videos: state.PlaylistReducer.videoThumbsForModal,
    loadMoreVideosButton: state.PlaylistReducer.loadMoreButtonForModal
  }),
  {
    changePlaylistVideos: changePlaylistVideosAsync,
    getMoreVideosForModal: getMoreVideosForModalAsync
  }
)
export default class EditPlaylistModal extends Component {
  constructor(props) {
    super()
    this.state = {
      selectedVideos: props.selectedVideos
    }
    this.handleHide = this.handleHide.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  render() {
    const {modalType, videos, loadMoreVideosButton,  getMoreVideosForModal} = this.props;
    const {selectedVideos} = this.state;
    const last = (array) => {
      return array[array.length - 1];
    };
    const lastId = last(videos) ? last(videos).id : 0;
    return (
      <Modal
        {...this.props}
        animation={false}
        backdrop="static"
        dialogClassName="modal-extra-lg"
        onHide={this.handleHide}
      >
        <Modal.Header closeButton>
          {modalType === 'change' ?
            <h4>Add or Remove Videos</h4>
            :
            <h4>Reorder Videos</h4>
          }
        </Modal.Header>
        <Modal.Body>
          {modalType === 'change' &&
            <SelectVideosForm
              videos={videos}
              selectedVideos={selectedVideos}
              loadMoreVideosButton={loadMoreVideosButton}
              onSelect={(selected, videoId) => this.setState({selectedVideos: selected.concat([videoId])})}
              onDeselect={selected => this.setState({selectedVideos: selected})}
              loadMoreVideos={() => {getMoreVideosForModal(lastId)}}
            />
          }
          {modalType === 'reorder' &&
            <div className="row">
              {selectedVideos.map(videoId => {
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
                      const selectedVideoArray = selectedVideos;
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
          <Button onClick={this.handleHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSave}
            disabled={selectedVideos.length < 2}
          >
            Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleHide() {
    this.props.onHide();
  }

  handleSave() {
    const {selectedVideos} = this.state;
    const {playlistId, changePlaylistVideos} = this.props;
    changePlaylistVideos(playlistId, selectedVideos, this);
  }
}
