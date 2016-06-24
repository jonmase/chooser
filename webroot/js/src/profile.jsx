import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import ProfileContainer from './profile/profile-container.jsx';

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
    <ProfileContainer />, 
    document.getElementById('profile')
);
