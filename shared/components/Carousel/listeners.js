import {setDimensions} from './helpers';

export function onResize() {
  if (!this.props.chatMode) {
    setDimensions.bind(this)();
  }
}

export function onReadyStateChange() {
  setDimensions.bind(this)();
}
