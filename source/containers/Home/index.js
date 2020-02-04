import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ImageEditModal from 'components/Modals/ImageEditModal';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/ErrorBoundary';
import ProfileWidget from 'components/ProfileWidget';
import HomeMenuItems from 'components/HomeMenuItems';
import Notification from 'components/Notification';
import People from './People';
import Stories from './Stories';
import LocalContext from './Context';
import { Route, Switch } from 'react-router-dom';
import { container, Left, Center, Right } from './Styles';

Home.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onFileUpload: PropTypes.func
};

function Home({ history, location, onFileUpload }) {
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  return (
    <ErrorBoundary>
      <LocalContext.Provider
        value={{
          onFileUpload
        }}
      >
        <div className={container}>
          <div className={Left}>
            <ProfileWidget
              history={history}
              onShowAlert={() => setAlertModalShown(true)}
              onLoadImage={upload => {
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
                render={({ history, location }) => (
                  <People location={location} history={history} />
                )}
              />
              <Route
                exact
                path="/"
                render={({ location, history }) => (
                  <Stories location={location} history={history} />
                )}
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
              }}
            />
          )}
          {alertModalShown && (
            <AlertModal
              title="Image is too large (limit: 10mb)"
              content="Please select a smaller image"
              onHide={() => setAlertModalShown(false)}
            />
          )}
        </div>
      </LocalContext.Provider>
    </ErrorBoundary>
  );
}

export default memo(Home);
