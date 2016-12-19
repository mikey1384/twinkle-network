import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';

export default class ImageEditModal extends Component {
  render() {
    const {onHide, imageUri, onConfirm, processing} = this.props;
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
        dialogClassName="modal-extra-lg"
      >
        <Modal.Header closeButton>
          <h4>Create Profile Picture</h4>
        </Modal.Header>
        <Modal.Body>
          <div style={{textAlign: 'center'}}>
            {imageUri &&
              <AvatarEditor
                ref="editor"
                image={imageUri}
                width={350}
                height={350}
                border={50}
                color={[255, 255, 255, 0.6]}
                scale={1}
              />
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={() => onConfirm(this.refs.editor.getImage().toDataURL("image/jpeg", 0.7))}
            disabled={processing}
          >
            Submit
          </Button>
          {processing && <span>Uploading...</span>}
        </Modal.Footer>
      </Modal>
    )
  }
}
