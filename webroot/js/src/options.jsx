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
    case 'view': 
        var container = <ViewContainer 
            action={data.action} 
            choice={data.choice} 
            options={data.options} 
            optionIds={data.optionIds} 
        />;
        break;
    case 'edit': 
        var container = <EditContainer 
            action={data.action} 
            choice={data.choice} 
            options={data.options} 
            optionIds={data.optionIds} 
        />;
        break;
    case 'approve': 
        var container = <ApproveContainer 
            action={data.action} 
            choice={data.choice} 
            options={data.options} 
            optionIds={data.optionIds} 
        />;
        break;
    default:
        break;
}



ReactDOM.render(
    container, 
    document.getElementById('index')
);
