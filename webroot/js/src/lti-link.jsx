import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';

import LinkContainer from './lti-link/lti-link-container.jsx';

injectTapEventPlugin();

ReactDOM.render(<LinkContainer choices={data.choices} />, document.getElementById('link'));
