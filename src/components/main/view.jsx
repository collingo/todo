'use strict';

import React from 'react/addons';

import Store from '../../flux/store';
import Router from '../../flux/router';
import TodoList from '../todo-list/view.jsx';

Router.init();

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
const Main = React.createClass({
  displayName: 'Main',
  getInitialState() {
    return Store.getData();
  },
  onStoreChange() {
    this.setState(Store.getData());
  },
  componentDidMount() {
    Store.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount() {
    Store.removeChangeListener(this.onStoreChange);
  },
  render() {
    var todo = this.state.currentTodo;
    return (
      <div id="TodoApp">
        <h1>{todo.text || 'Todo'}</h1>
        {this.renderBack()}
        <TodoList node={todo} />
      </div>
    );
  },
  renderBack() {
    return this.state.currentTodo.parent !== undefined ? (<button onClick={this.clickBack}>Back</button>) : null;
  },
  clickBack(e) {
    e.preventDefault();
    Router.navigate(['/todos', this.state.currentTodo.parent].join('/'));
  }
});

export default Main;
