import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import AvatarEditor from 'react-avatar-editor'

export default class ImageEditModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    imageUri: PropTypes.string,
    onConfirm: PropTypes.func,
    processing: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      imageScale: 1
    }
  }
  render() {
    const {onHide, imageUri, onConfirm, processing} = this.props
    const {imageScale} = this.state
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
          <div style={{textAlign: 'center', paddingBottom: '2em'}}>
            {imageUri &&
              <div>
                <AvatarEditor
                  ref="editor"
                  image={imageUri}
                  width={350}
                  height={350}
                  border={30}
                  color={[255, 255, 255, 0.6]}
                  scale={imageScale}
                />
                <div className="col-xs-6 col-xs-offset-3">
                  <Slider
                    className="rc-slider"
                    defaultValue={50}
                    onChange={value => this.setState({imageScale: value/100 + 0.5})}
                  />
                </div>
              </div>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={onHide}>Cancel</Button>
          <Button
            className="btn btn-primary"
            onClick={() => onConfirm(this.refs.editor.getImage().toDataURL('image/jpeg', 0.7))}
            disabled={processing}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
