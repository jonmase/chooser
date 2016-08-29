import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import ViewContainer from './options-view/view-container.jsx';

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
        options={data.options} 
    />, 
    document.getElementById('options')
);
