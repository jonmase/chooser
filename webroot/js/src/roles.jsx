import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import RolesContainer from './roles/role-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <RolesContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard} 
        roleOptions={data.roleOptions} 
        sections={data.sections} 
    />, 
    document.getElementById('roles')
);
