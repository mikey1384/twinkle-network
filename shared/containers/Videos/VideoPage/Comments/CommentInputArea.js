import React, {Component} from 'react';
import InputArea from 'components/InputArea';
import TitleDescriptionForm from 'components/TitleDescriptionForm';
import Button from 'components/Button';
import {stringIsEmpty} from 'helpers/stringHelpers';
import {connect} from 'react-redux';
import {
  uploadVideoCommentAsync,
  uploadVideoDebate,
  loadMoreDebates
} from 'redux/actions/VideoActions';
import DebatePanel from './DebatePanel';

@connect(
  null,
  {
    uploadComment: uploadVideoCommentAsync,
    uploadDebate: uploadVideoDebate,
    loadMoreDebates
  }
)
export default class CommentInputArea extends Component {
  constructor() {
    super()
    this.state = {
      debateTabActive: true,
      debateFormShown: false
    }
  }
  render() {
    const {
      videoId, uploadComment, uploadDebate, loadMoreDebatesButton, debates, loadMoreDebates
    } = this.props;
    const {debateTabActive, debateFormShown} = this.state;
    return (
      <div className="page-header">
        <div className="row container-fluid">
          <ul className="nav nav-tabs">
            <li
              className={debateTabActive && 'active'}
              style={{cursor: 'pointer'}}
              onClick={() => this.setState({debateTabActive: true})}
            >
              <a>Discuss</a>
            </li>
            <li
              className={!debateTabActive && 'active'}
              style={{cursor: 'pointer'}}
              onClick={() => this.setState({
                debateTabActive: false,
                debateFormShown: false
              })}
            >
              <a>Comment on this video</a>
            </li>
          </ul>
        </div>
        <div style={{marginTop: '1.5em'}}>
          {debateTabActive && <div>
              <div>
                <div className="container-fluid">
                  {debateFormShown ?
                    <TitleDescriptionForm
                      autoFocus
                      onSubmit={(title, description) => uploadDebate(title, description, videoId)}
                      rows={4}
                      titlePlaceholder="Enter discussion topic..."
                      descriptionPlaceholder="Enter details... (Optional)"
                    /> :
                    <Button
                      className="btn btn-primary"
                      onClick={() => this.setState({debateFormShown: true})}
                    >
                      Start a New Discussion
                    </Button>
                  }
                </div>
                <div className="container-fluid">
                  {!!debates && debates.length > 0 && <h3 style={{marginTop: '1em'}}>Active Discussions</h3>}
                  {!!debates && debates.map(debate =>
                    <DebatePanel
                      key={debate.id}
                      videoId={videoId}
                      {...debate}
                    />
                  )}
                  {loadMoreDebatesButton &&
                    <div className="text-center" style={{paddingTop: '0.5em'}}>
                      <Button
                        className="btn btn-success"
                        onClick={() => loadMoreDebates(videoId, debates[debates.length - 1].id)}
                      >
                        Load More
                      </Button>
                    </div>
                  }
                  <h3 style={{marginTop: '1em'}}>Comment on this video</h3>
                  <InputArea
                    onSubmit={text => uploadComment(text, videoId)}
                    rows={4}
                    placeholder="Write your comment here..."
                  />
                </div>
              </div>
            </div>
          }
          {!debateTabActive && <div className="container-fluid">
              <InputArea
                autoFocus
                onSubmit={text => uploadComment(text, videoId)}
                rows={4}
                placeholder="Write your comment here..."
              />
            </div>
          }
        </div>
      </div>
    )
  }
}
