import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TopBar from './elements/topbar.jsx';

import ViewContainer from './options/view-container.jsx';
import EditContainer from './options/edit-container.jsx';
import ApproveContainer from './options/approve-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <TopBar 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        menu={data.sections?true:false}
        sections={data.sections?data.sections:null} 
    />, 
    document.getElementById('topbar')
);

switch(data.action) {
    case 'edit': 
        var ContainerClass = EditContainer;
        break;
    case 'approve': 
        var ContainerClass = ApproveContainer
        break;
    case 'view': 
    default:
        var ContainerClass = ViewContainer;
        break;
}

ReactDOM.render(
    <ContainerClass 
        action={data.action} 
        choice={data.choice} 
    />, 
    document.getElementById('index')
);
