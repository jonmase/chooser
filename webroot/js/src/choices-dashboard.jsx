import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TopBar from './elements/topbar.jsx';
import DashboardCards from './choices-dashboard/sections-cards.jsx';

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.subtitle} />, document.getElementById('topbar'));
ReactDOM.render(<DashboardCards roles={data.roles} choiceId={data.choiceId} />, document.getElementById('grid'));
