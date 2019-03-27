import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import ImageEditModal from 'components/Modals/ImageEditModal';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ProfileWidget from 'components/ProfileWidget';
import HomeMenuItems from 'components/HomeMenuItems';
import Notification from 'components/Notification';
import { uploadProfilePic } from 'redux/actions/UserActions';
import { Route, Switch } from 'react-router-dom';
import { container, Left, Center, Right } from './Styles';
import loadable from 'loadable-components';
const People = loadable(() => import('./People'), {
  LoadingComponent: Loading
});
const Stories = loadable(() => import('./Stories'), {
  LoadingComponent: Loading
});

Home.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  uploadProfilePic: PropTypes.func.isRequired
};

function Home({ history, location, uploadProfilePic }) {
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [processing, setProcessing] = useState(false);

  return (
    <ErrorBoundary>
      <div className={container}>
        <div className={Left}>
          <ProfileWidget
            history={history}
            showAlert={() => setAlertModalShown(true)}
            loadImage={upload => {
              setImageEditModalShown(true);
              setImageUri(upload.target.result);
            }}
          />
          <HomeMenuItems
            style={{ marginTop: '1rem' }}
            history={history}
            location={location}
          />
        </div>
        <div className={Center}>
          <Switch>
            <Route
              path="/users"
              render={({ history }) => <People history={history} />}
            />
            <Route
              exact
              path="/"
              render={({ history }) => <Stories history={history} />}
            />
          </Switch>
        </div>
        <Notification className={Right} location="home" />
        {imageEditModalShown && (
          <ImageEditModal
            imageUri={imageUri}
            onHide={() => {
              setImageUri(null);
              setImageEditModalShown(false);
              setProcessing(false);
            }}
            processing={processing}
            onConfirm={uploadImage}
          />
        )}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => setAlertModalShown(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  async function uploadImage(image) {
    setProcessing(true);
    await uploadProfilePic(image);
    setImageUri(null);
    setProcessing(false);
    setImageEditModalShown(false);
  }
}

export default connect(
  null,
  { uploadProfilePic }
)(Home);
