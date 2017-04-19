import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TopBar from './elements/topbar.jsx';

import OptionContainer from './options/option-container.jsx';

injectTapEventPlugin();

/*ReactDOM.render(
    <TopBar 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        menu={data.sections?true:false}
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('topbar')
);*/

ReactDOM.render(
    <OptionContainer 
        action={data.action} 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        roles={data.roles} 
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('index')
);
