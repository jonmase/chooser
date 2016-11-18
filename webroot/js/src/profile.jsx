import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ProfileContainer from './profile/profile-container.jsx';

injectTapEventPlugin();

ReactDOM.render(
    <ProfileContainer 
        choice={data.choice} 
        dashboardUrl={data.dashboard} 
        profile={data.profile}
        sections={data.sections} 
    />, 
    document.getElementById('profile')
);
