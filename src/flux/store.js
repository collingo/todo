import {EventEmitter} from 'events';
import assign from 'lodash/object/assign';
import clone from 'lodash/lang/cloneDeep';
import remove from 'lodash/array/remove';
import find from 'lodash/collection/find';
import findWhere from 'lodash/collection/findWhere';
import filter from 'lodash/collection/filter';

import window from '../../server/adaptors/window';
import nulls from './nulls.json';
import fetcher from '../lib/fetcher';

const todos = [{
  id: '0',
  text: 'Shopping',
  children: ['1','2','3']
}, {
  id: '1',
  parent: '0',
  text: 'Eggs',
}, {
  id: '2',
  parent: '0',
  text: 'Bread',
  children: ['4']
}, {
  id: '3',
  parent: '0',
  text: 'Milk'
}, {
  id: '4',
  parent: '2',
  text: 'Flour',
  children: ['5']
}, {
  id: '5',
  parent: '4',
  text: 'Grain'
}];

const _data = {
  currentPage: 'todos',
  currentIndex: '0',
  currentTodo: getTodo('0')
};

function getTodo(index, shallow) {
  const todo = findWhere(todos, {
    id: index
  });
  return shallow ? todo : populateChildren(todo);
}

function populateChildren(todo) {
  todo = clone(todo);
  if(todo.children) {
    todo.children = todo.children.map((childIndex) => {
      return getTodo(childIndex, true);
    });
  }
  return todo;
}

const Store = assign({}, EventEmitter.prototype, {

  getData() {
    return _data;
  },

  loadData(required) {
    required.forEach((params) => {
      Store.load(params.type, params.id);
    });
  },

  load(type, id) {
    let propertyName = Store.getPropertyName(type);
    const itemInStore = _data[propertyName];

    if (!(itemInStore && itemInStore.id === id)) {
      console.log('Loading...', type, (id || ''));

      _data[propertyName] = nulls[type];
      Store.emitChange();

      fetcher({
        url: '/api' + type + (id ? 's/'+id : ''),
        success: (data) => {
          Store.applyData(propertyName, data);
        }
      });
    } else {
      console.log('Already loaded', type, (id || ''));
    }
  },

  applyData(propertyName, data) {
    _data[propertyName] = assign(clone(_data[propertyName]), data);
    console.log('Loaded', propertyName, _data[propertyName]);
    Store.emitChange();
  },

  sendData(to, method, postData, success, failure) {
    console.log('Sending...', to, postData);
    fetcher({
      url: '/api/'+to,
      method: method || 'post',
      body: postData && JSON.stringify(postData),
      success: (responseData) => {
        console.log('Response received', responseData);
        success && success(responseData);
      },
      failure: (errorData) => {
        console.log('Error received', errorData);
        failure && failure(errorData);
      }
    });
  },

  getPropertyName(type) {
    return 'current' + type.charAt(0).toUpperCase() + type.slice(1);
  },

  emitChange() {
    Store.emit('change');
  },

  addChangeListener(callback) {
    Store.on('change', callback);
  },

  removeChangeListener(callback) {
    Store.removeListener('change', callback);
  }

});

(typeof window !== 'undefined') && (window._Store = Store);

module.exports = {
  getData: Store.getData,
  loadData: Store.loadData,
  addChangeListener: Store.addChangeListener,
  removeChangeListener: Store.removeChangeListener,

  // add Store methods here
  setPage(newPage) {
    _data.currentPage = newPage;
    Store.emitChange();
  },
  setTodo(tid) {
    _data.currentIndex = tid;
    _data.currentTodo = getTodo(tid);
    Store.emitChange();
  }
};
