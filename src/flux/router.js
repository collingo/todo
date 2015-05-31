import RoutePattern from "route-pattern";
import urllite from 'urllite';
import find from 'lodash/collection/find';

import manifest from '../../package.json';
import Actions from './actions';

const handlers = {
  home() {
    Actions.goTo('home');
  }
}

/**
  Example route definitions
  {
    '/': function () {},
    '/projects': function () {},
    '/projects/:pid': function (pid) {}
  }
*/
const routes = {
  '/': handlers.home
};

function notfound (url) {
  console.log('notfound', url);
  Actions.goTo('notfound');
}

function setUrl (url, replace) {
  const data = urllite(url);
  const name = manifest.name;
  data.href = url;

  if (replace) {
    window.history.replaceState(data, name, url);
  } else {
    window.history.pushState(data, name, url)
  }
}

function init () {
  const initialUrl = urllite(window.location.href);

  window.onpopstate = (event) => {
    const path = event.state.pathname + event.state.hash;
    navigate(path, true);
  };

  if (!RoutePattern.fromString('/').matches(initialUrl.pathname)) {
    navigate(initialUrl.pathname+initialUrl.hash, false, true);
  } else {
    setUrl(window.location.href, true);
    handlers.home();
  }
}

function navigate (urlString, ignoreUrl, replaceState) {
  const url = urllite(urlString);
  const pathname = url.pathname;
  let action;
  let params;
  let pattern = find(Object.keys(routes), (route) => {
    return RoutePattern.fromString(route).matches(pathname);
  });

  if (pattern) {
    action = routes[pattern],
    params = RoutePattern.fromString(pattern).match(pathname).params;
  } else {
    action = notfound;
    params = [pathname];
  }
  if (!ignoreUrl) {
    console.log('Setting url', pathname);
    setUrl(pathname, replaceState);
  }
  action.apply(this, params);
};


export default {
  init,
  navigate
};
