var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');
var RolesContainer = require('./choices-roles/roles-container.jsx');
//var RolesSettingsForm = require('./choices-roles/roles-settings.jsx');
//var UsersTable = require('./choices-roles/users-table.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.choice.name} />, document.getElementById('topbar'));
//ReactDOM.render(<RolesSettingsForm choice={data.choice} roleOptions={data.roleOptions} />, document.getElementById('roles_settings'));
//ReactDOM.render(<UsersTable choice={data.choice} users={data.users} roleOptions={data.roleOptions} />, document.getElementById('roles_table'));
ReactDOM.render(
    <RolesContainer 
        choiceId={data.choice.id} 
        initialNotify={data.choice.notify_additional_permissions} 
        initialDefaultRoles={data.choice.instructor_default_roles} 
        initialUsers={data.users} 
        initialUserSort={data.userSort} 
        roleOptions={data.roleOptions} 
    />, 
    document.getElementById('roles')
);
