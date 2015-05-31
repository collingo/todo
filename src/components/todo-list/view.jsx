'use strict';

import React from 'react/addons';

import TodoListItem from '../todo-list-item/view.jsx';

const TodoList = React.createClass({
  displayName: 'TodoList',
  render: function () {
    var children = (this.props.node.children || []).map((todo) => {
      return (
        <TodoListItem
          key={todo.id}
          todo={todo}
        />
      );
    }, this);
    return (
      <div className="todo-list children">
        <ul>
          {children}
        </ul>
      </div>
    );
  }
});

export default TodoList;
