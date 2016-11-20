import ReactDOM from 'react-dom';

export function scrollElementToCenter(element) {
  window.scrollTo(0, ReactDOM.findDOMNode(element).offsetTop - window.innerHeight/2);
}
