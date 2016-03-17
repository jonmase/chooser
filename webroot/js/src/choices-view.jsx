var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.subtitle} />, document.getElementById('topbar'));
