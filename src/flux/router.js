import RoutePattern from "route-pattern";
import urllite from 'urllite';
import find from 'lodash/collection/find';

import window from '../../server/adaptors/window';
import manifest from '../../package.json';
import Actions from './actions';

const handlers = {
  home() {
    navigate('/todos/0', false, true);
  },
  todos() {
    navigate('/todos/0', false, true);
  },
  todo(tid) {
    Actions.goTo('todos');
    Actions.setTodo(tid);
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
  '/': handlers.home,
  '/todos': handlers.todos,
  '/todos/:tid': handlers.todo
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

function init (initialUrl) {
  const url = urllite(initialUrl || window.location.href);

  window.onpopstate = (event) => {
    const path = event.state.pathname + event.state.hash;
    navigate(path, true);
  };

  if (!RoutePattern.fromString('/').matches(url.pathname)) {
    navigate(url.pathname+url.hash, false, true);
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
