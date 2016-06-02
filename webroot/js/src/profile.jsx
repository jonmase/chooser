import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import ProfileContainer from './profile/profile-container.jsx';

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.subtitle} menu={true} />, document.getElementById('topbar'));
ReactDOM.render(
    <ProfileContainer />, 
    document.getElementById('profile')
);
