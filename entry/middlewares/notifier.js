import { socket } from '../../source/constants/io';

const validActors = ['VIDEO', 'FEED', 'LINK'];

function createNotifier() {
  return () => next => action => {
    const { type } = action;
    if (type) {
      const typeKeyArray = type.split('_');
      const actionKey = typeKeyArray[0];
      const actorKey = typeKeyArray[typeKeyArray.length - 1];
      if (validActors.indexOf(actorKey) !== -1 && actionKey === 'UPLOAD') {
        socket.emit('new_upload');
      }
    }
    return next(action);
  };
}

const notifier = createNotifier();

export default notifier;
