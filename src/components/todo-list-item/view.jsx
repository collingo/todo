'use strict';

import React from 'react/addons';
import classnames from 'classnames';

import Router from '../../flux/router';

const TodoListItem = React.createClass({
  displayName: 'TodoListItem',
  render() {
    const todo = this.props.todo;
    const classes = classnames('todo-list-item', {
      children: !!todo.children
    });
    return (
      <li className={classes} onClick={this.getClickHandler()}>
        <span>{todo.text}</span>
        {this.renderCount()}
      </li>
    );
  },
  renderCount() {
    const todo = this.props.todo;
    return todo.children ? <span>{todo.children.length}</span> : null;
  },
  getClickHandler() {
    let handler;
    if(this.props.todo.children) {
      handler = (e) => {
        e.preventDefault();
        Router.navigate(['/todos', this.props.todo.id].join('/'));
      };
    }
    return handler;
  }
});

export default TodoListItem;
