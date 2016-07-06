import {setDimensions} from './styles';

export function onResize() {
  if (!this.props.chatMode) {
    setDimensions.call(this);
  }
}

export function onReadyStateChange() {
  setDimensions.call(this);
}
