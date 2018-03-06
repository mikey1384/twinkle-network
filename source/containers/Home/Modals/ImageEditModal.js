import React, { Component } from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import AvatarEditor from 'react-avatar-editor'

export default class ImageEditModal extends Component {
  static propTypes = {
    imageUri: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    processing: PropTypes.bool
  }

  state = {
    imageScale: 1
  }

  render() {
    const { onHide, imageUri, onConfirm, processing } = this.props
    const { imageScale } = this.state
    return (
      <Modal onHide={onHide}>
        <header>Create Profile Picture</header>
        <main>
          <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            {imageUri && (
              <div>
                <AvatarEditor
                  ref={ref => {
                    this.Editor = ref
                  }}
                  image={imageUri}
                  width={350}
                  height={350}
                  border={30}
                  color={[255, 255, 255, 0.6]}
                  scale={imageScale}
                />
                <Slider
                  className="rc-slider"
                  defaultValue={50}
                  onChange={value =>
                    this.setState({ imageScale: value / 100 + 0.5 })
                  }
                />
              </div>
            )}
          </div>
        </main>
        <footer>
          <Button
            primary
            onClick={() =>
              onConfirm(this.Editor.getImage().toDataURL('image/jpeg', 0.7))
            }
            disabled={processing}
          >
            Submit
          </Button>
          <Button transparent onClick={onHide} style={{ marginRight: '1rem' }}>
            Cancel
          </Button>
        </footer>
      </Modal>
    )
  }
}
