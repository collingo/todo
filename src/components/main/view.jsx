'use strict';

import React from 'react/addons';

import Store from '../../flux/store';
import Router from '../../flux/router';
import Example from '../example/view.jsx';

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
    return (
      <div>
        Main
        <Example />
      </div>
    );
  }
});

export default Main;
