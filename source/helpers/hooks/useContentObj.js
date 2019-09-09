import { useState } from 'react';

export default function useContentObj(props) {
  const initialState = {
    stars: [],
    childComments: [],
    likes: [],
    subjects: [],
    commentsLoadMoreButton: false,
    subjectsLoadMoreButton: false
  };
  const [contentObj, setContentObj] = useState({
    ...initialState,
    ...props
  });

  function onLoadSubjects({ results, loadMoreButton }) {
    setContentObj(contentObj => ({
      ...contentObj,
      subjects: results,
      subjectsLoadMoreButton: loadMoreButton
    }));
  }

  function onLoadTags({ tags }) {
    setContentObj(contentObj => ({
      ...contentObj,
      tags
    }));
  }

  return {
    contentObj,
    setContentObj,
    onLoadSubjects,
    onLoadTags
  };
}
