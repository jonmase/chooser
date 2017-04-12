import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import EditSetupContainer from './edit-setup/edit-setup-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <EditSetupContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('view')
);
