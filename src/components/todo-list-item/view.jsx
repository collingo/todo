'use strict';

import React from 'react/addons';
import classnames from 'classnames';

import Router from '../../flux/router';

const TodoListItem = React.createClass({
  displayName: 'TodoListItem',
  render() {
    const classes = classnames('todo-list-item', {
      children: !!this.props.todo.children
    });
    return (
      <li className={classes}>
        {this.renderTodoContent()}
      </li>
    );
  },
  renderCount() {
    const todo = this.props.todo;
    return todo.children ? <span>{todo.children.length}</span> : null;
  },
  renderTodoContent() {
    const todo = this.props.todo;
    let content = (
      <span>
        <span>{todo.text}</span>
        {this.renderCount()}
      </span>
    );
    if(this.props.todo.children) {
      content = (
        <a href={['/todos', this.props.todo.id].join('/')} onClick={this.onClickTodo}>
          {content}
        </a>
      );
    }
    return content;
  },
  onClickTodo(e) {
    e.preventDefault();
    Router.navigate(['/todos', this.props.todo.id].join('/'));
  }
});

export default TodoListItem;
