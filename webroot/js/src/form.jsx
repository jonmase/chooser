import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import FormContainer from './form/form-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <FormContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard} 
        sections={data.sections} 
    />, 
    document.getElementById('form')
);
