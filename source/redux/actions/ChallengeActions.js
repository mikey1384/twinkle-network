import CHALLENGE from '../constants/Challenge';

export const getFeaturedChallenges = challenges => ({
  type: CHALLENGE.LOAD_FEATURED_CHALLENGES,
  challenges
});
