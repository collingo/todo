import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

import assign from 'lodash/object/assign';
import pick from 'lodash/object/pick';

(typeof window !== 'undefined') && (window.ajaxPending = false);
let ajaxes = {};

function fetcher (config) {
  const req = fetch(config.url, assign({
      method: 'get',
      credentials: 'include',
      headers: config.body && {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, pick(config, ['method', 'body'])))
    .then((response) => {
      remove(config.url);
      if (response.status >= 400) {
        if(config.failure) {
          config.failure(response);
        } else {
          throw new Error("Bad response from server");
        }
      }
      return response.json();
    })
    .then(config.success)
    .catch(config.failure);
  add(config.url, req);
}

function add (url, req) {
  ajaxes[url] = req;
  window.ajaxPending = true;
}

function remove (url) {
  delete ajaxes[url];
  window.ajaxPending = !!Object.keys(ajaxes).length;
}

export default fetcher;
