import PropTypes from 'prop-types';
import React from 'react';
import Selectable from './Selectable';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';

SelectUploadsForm.propTypes = {
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
      {uploads.map((upload, index) => {
        return (
          <Selectable
            key={index}
            item={upload}
            selected={
              selectedUploads
                .map(selected => selected.id)
                .indexOf(upload.id) !== -1
            }
            onSelect={upload => onSelect(upload)}
            onDeselect={uploadId => onDeselect(uploadId)}
            type={type}
          />
        );
      })}
      {loadMoreButton && (
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
