import CHALLENGE from '../constants/Challenge';

export const getFeaturedSubjects = challenges => ({
  type: CHALLENGE.LOAD_FEATURED_CHALLENGES,
  challenges
});
