import './style.css'
import Icon from './baima.jpg'

function getComponent() {
  // Lodash, now imported by this script
  return import( /* webpackChunkName: "lodash" */ 'lodash' ).then( _ => {
    let element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
  }).catch(error => 'An error occurred while loading the component');
}

getComponent().then(component => {
  document.body.appendChild(component);
});
