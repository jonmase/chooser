var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./topbar.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar />, document.getElementById('topbar'));
