import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import ViewContainer from './choices-setup/setup-container.jsx';

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

ReactDOM.render(
    <ViewContainer 
        choice={data.choice} 
        instance={data.instance} 
        ruleCategoryFields={data.ruleCategoryFields} 
    />, 
    document.getElementById('view')
);
