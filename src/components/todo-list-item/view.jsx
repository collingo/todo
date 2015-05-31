'use strict';

import React from 'react/addons';

import Router from '../../flux/router';

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
    Router.navigate(['/todos', this.props.todo.id].join('/'));
  }
});

export default TodoListItem;
