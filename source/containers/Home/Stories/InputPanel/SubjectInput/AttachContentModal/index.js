import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';
import SelectAttachmentScreen from './SelectAttachmentScreen';

const sectionObj = {
  start: {
    title: 'Which Content Type?',
    doneShown: false
  },
  selectVideo: {
    title: 'Select a Video',
    doneShown: true,
    back: 'start'
  },
  selectLink: {
    title: 'Select a Webpage',
    doneShown: true,
    back: 'start'
  }
};

export default class AttachContentModal extends Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
  };

  state = {
    section: 'start',
    selected: undefined
  };

  render() {
    const { onHide } = this.props;
    const { section, selected } = this.state;
    return (
      <Modal
        large={section === 'selectVideo' || section === 'selectLink'}
        onHide={onHide}
      >
        <header>{sectionObj[section].title}</header>
        <main>
          {section === 'start' && (
            <StartScreen navigateTo={section => this.setState({ section })} />
          )}
          {section === 'selectVideo' && (
            <SelectAttachmentScreen
              type="video"
              onSelect={video =>
                this.setState({
                  selected: { type: 'video', id: video.id, title: video.title }
                })
              }
              onDeselect={() => this.setState({ selected: undefined })}
            />
          )}
          {section === 'selectLink' && (
            <SelectAttachmentScreen
              type="url"
              onSelect={link =>
                this.setState({
                  selected: { type: 'url', id: link.id, title: link.title }
                })
              }
              onDeselect={() => this.setState({ selected: undefined })}
            />
          )}
          {section === 'add' && <div>something</div>}
        </main>
        <footer>
          <Button
            transparent
            onClick={
              sectionObj[section].back
                ? () =>
                    this.setState({
                      section: sectionObj[section].back,
                      selected: undefined
                    })
                : onHide
            }
          >
            {sectionObj[section].back ? 'Back' : 'Cancel'}
          </Button>
          {sectionObj[section].doneShown && (
            <Button
              disabled={!selected}
              primary
              style={{ marginLeft: '0.7rem' }}
              onClick={this.onConfirm}
            >
              Confirm
            </Button>
          )}
        </footer>
      </Modal>
    );
  }

  onConfirm = () => {
    const { onConfirm } = this.props;
    const { selected } = this.state;
    onConfirm(selected);
  };
}
