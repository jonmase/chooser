import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TopBar from './elements/topbar.jsx';
import DashboardCards from './choices-dashboard/sections-cards.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <TopBar 
        choice={data.choice} 
    />, 
    document.getElementById('topbar')
);
ReactDOM.render(<DashboardCards sections={data.sections} />, document.getElementById('grid'));
