import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ChoosingSettingsContainer from './choosing-settings/choosing-settings-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <ChoosingSettingsContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('view')
);
