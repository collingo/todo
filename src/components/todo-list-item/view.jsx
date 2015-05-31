'use strict';

import React from 'react/addons';

import Actions from '../../flux/actions';

const TodoListItem = React.createClass({
  displayName: 'TodoListItem',
  render: function () {
    return (
      <li className="todo-list-item" onClick={this.handleClick}>
        {this.props.todo.text}
      </li>
    );
  },
  handleClick: function (e) {
    e.preventDefault();
    Actions.setCurrentTodo(this.props.todo.id);
  }
});

export default TodoListItem;
