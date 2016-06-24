import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import RolesContainer from './choices-roles/roles-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <TopBar 
        choice={data.choice} 
        dashboardUrl={data.dashboard} 
        menu={true}
        sections={data.sections} 
    />, 
    document.getElementById('topbar')
);

ReactDOM.render(
    <RolesContainer 
        choiceId={data.choice.id} 
        initialNotify={data.choice.notify_additional_permissions} 
        initialDefaultRoles={data.choice.instructor_default_roles} 
        initialUsers={data.users} 
        initialUserSortField={data.userSortField} 
        roleOptions={data.roleOptions} 
    />, 
    document.getElementById('roles')
);
