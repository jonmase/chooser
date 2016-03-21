var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');
var UsersTable = require('./choices-roles/users-table.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.subtitle} />, document.getElementById('topbar'));
ReactDOM.render(<UsersTable choiceId={data.choiceId} users={data.users} />, document.getElementById('table'));
