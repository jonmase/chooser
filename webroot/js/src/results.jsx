import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TopBar from './elements/topbar.jsx';

import ResultsContainer from './results/results-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <ResultsContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard?data.dashboard:null} 
        sections={data.sections?data.sections:null} 
        title={data.title}
    />, 
    document.getElementById('index')
);
