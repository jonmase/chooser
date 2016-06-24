import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import FormContainer from './choices-form/form-container.jsx';

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
    <FormContainer 
        choice={data.choice} 
        menu={true}
    />, 
    document.getElementById('form')
);
