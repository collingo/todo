var jsdom = require("jsdom").jsdom;

if (typeof document !== 'undefined') return

// mock browser setup
global.document = jsdom('<html><body><div id="sandbox"></div></body></html>', {});
global.window = document.parentWindow;
global.navigator = window.navigator;

// React
global.React = require('react/addons');
global.ReactTestUtils = React.addons.TestUtils;

// test libs
global.chai = require("chai");
global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.expect = chai.expect;
chai.use(sinonChai);
