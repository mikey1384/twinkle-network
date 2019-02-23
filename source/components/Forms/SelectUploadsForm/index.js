import PropTypes from 'prop-types';
import React from 'react';
import Selectable from './Selectable';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';

SelectUploadsForm.propTypes = {
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  loadMoreUploads: PropTypes.func,
  loadMoreButton: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  selectedUploads: PropTypes.array.isRequired,
  type: PropTypes.string,
  uploads: PropTypes.array.isRequired
};

export default function SelectUploadsForm({
  uploads,
  selectedUploads,
  loading,
  loadingMore,
  loadMoreButton,
  onSelect,
  onDeselect,
  loadMoreUploads,
  type = 'video'
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%'
      }}
    >
      {loading ? (
        <Loading />
      ) : uploads.length === 0 ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItmes: 'center',
            fontSize: '2.5rem',
            padding: '3rem'
          }}
        >
          No Results
        </div>
      ) : (
        uploads.map((upload, index) => {
          return (
            <Selectable
              key={index}
              item={upload}
              selected={
                selectedUploads
                  .map(selected => selected.id)
                  .indexOf(upload.id) !== -1
              }
              onSelect={onSelect}
              onDeselect={onDeselect}
              type={type}
            />
          );
        })
      )}
      {loadMoreButton && !loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <LoadMoreButton
            style={{ fontSize: '2rem', marginTop: '1rem' }}
            transparent
            loading={loadingMore}
            onClick={loadMoreUploads}
          >
            Load More
          </LoadMoreButton>
        </div>
      )}
    </div>
  );
}
