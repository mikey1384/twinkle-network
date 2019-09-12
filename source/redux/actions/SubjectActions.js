import SUBJECT from '../constants/Subject';

export const clearSubjectsLoaded = () => ({
  type: SUBJECT.CLEAR_LOADED
});

export const getFeaturedSubjects = subjects => ({
  type: SUBJECT.LOAD_FEATURED_SUBJECTS,
  subjects
});
