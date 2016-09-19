const defaultState = {
  notifications: [
    {
      message: 'Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."',
      time: '1 hour ago',
      id: 1
    },
    {
      message: 'Charles reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."',
      time: '2 hour ago',
      id: 2
    },
    {
      message: 'Tony reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."',
      time: '3 hour ago',
      id: 3
    }
  ]
};

export default function NotiReducer(state = defaultState, action) {
  switch(action.type) {
    case 'FETCH_NOTIFICATIONS':
      return state;
    default:
      return state;
  }
}
