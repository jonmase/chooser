import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import DashboardCards from './dashboard/dashboard-cards.jsx';

injectTapEventPlugin();

ReactDOM.render(<DashboardCards sections={data.sections} choice={data.choice} />, document.getElementById('dashboard'));
