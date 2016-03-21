var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');
var RolesSettingsForm = require('./choices-roles/roles-settings.jsx');
var UsersTable = require('./choices-roles/users-table.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.subtitle} />, document.getElementById('topbar'));
ReactDOM.render(<RolesSettingsForm choiceId={data.choiceId} roleOptions={data.roleOptions} defaultRoles={data.defaultRoles} />, document.getElementById('roles_settings'));
ReactDOM.render(<UsersTable choiceId={data.choiceId} users={data.users} />, document.getElementById('table'));
