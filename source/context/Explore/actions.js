export default function ExploreActions(dispatch) {
  return {
    onLoadFeaturedSubjects(subjects) {
      return dispatch({
        type: 'LOAD_FEATURED_SUBJECTS',
        subjects
      });
    },
    onReloadSubjects() {
      return dispatch({
        type: 'RELOAD_SUBJECTS'
      });
    }
  };
}
