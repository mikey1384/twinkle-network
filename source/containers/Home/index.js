import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Notification from 'components/Notification'
import ProfileWidget from 'components/ProfileWidget'
import HomeMenuItems from 'components/HomeMenuItems'
import { container, Left, Center, Right } from './Styles'
import Loading from 'components/Loading'
import ImageEditModal from 'components/Modals/ImageEditModal'
import AlertModal from 'components/Modals/AlertModal'
import { uploadProfilePic } from 'redux/actions/UserActions'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import loadable from 'loadable-components'
const Profile = loadable(() => import('./Profile'), {
  LoadingComponent: Loading
})
const People = loadable(() => import('./People'), {
  LoadingComponent: Loading
})
const Stories = loadable(() => import('./Stories'), {
  LoadingComponent: Loading
})

class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    uploadProfilePic: PropTypes.func
  }

  state = {
    alertModalShown: false,
    imageEditModalShown: false,
    imageUri: null,
    processing: false
  }

  render() {
    const { history, location } = this.props
    const {
      alertModalShown,
      imageEditModalShown,
      imageUri,
      processing
    } = this.state
    return (
      <ErrorBoundary>
        <div className={container}>
          <div className={Left}>
            <ProfileWidget
              history={history}
              showAlert={() => this.setState({ alertModalShown: true })}
              loadImage={upload =>
                this.setState({
                  imageEditModalShown: true,
                  imageUri: upload.target.result
                })
              }
            />
            <HomeMenuItems
              style={{ marginTop: '1rem' }}
              history={history}
              location={location}
            />
          </div>
          <div className={Center}>
            <Route exact path="/" component={Stories} />
            <Route path="/users/:username" component={Profile} />
            <Route exact path="/users" component={People} />
          </div>
          <Notification className={Right} />
          {imageEditModalShown && (
            <ImageEditModal
              imageUri={imageUri}
              onHide={() =>
                this.setState({
                  imageUri: null,
                  imageEditModalShown: false,
                  processing: false
                })
              }
              processing={processing}
              onConfirm={this.uploadImage}
            />
          )}
          {alertModalShown && (
            <AlertModal
              title="Image is too large (limit: 5mb)"
              content="Please select a smaller image"
              onHide={() => this.setState({ alertModalShown: false })}
            />
          )}
        </div>
      </ErrorBoundary>
    )
  }

  uploadImage = async image => {
    const { uploadProfilePic } = this.props
    this.setState({
      processing: true
    })
    await uploadProfilePic(image)
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    })
  }
}

export default connect(
  null,
  { uploadProfilePic }
)(Home)
