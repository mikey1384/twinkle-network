import CHALLENGE from '../constants/Challenge';

const defaultState = {
  featuredChallenges: [],
  featuredChallengesLoaded: false
};

export default function ChallengeReducer(state = defaultState, action) {
  switch (action.type) {
    case CHALLENGE.LOAD_FEATURED_CHALLENGES:
      return {
        ...state,
        featuredChallenges: action.challenges,
        featuredChallengesLoaded: true
      };
    default:
      return state;
  }
}
