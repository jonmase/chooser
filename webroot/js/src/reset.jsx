import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ResetContainer from './reset/reset-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <ResetContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('reset')
);
