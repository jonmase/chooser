import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

var ResetContainer = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    componentDidMount: function() {
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Reset Choice"} />}
        />;
        
        return (
            <Container topbar={topbar} title={false}>
                {/*<Reset
                    handlers={settingsHandlers}
                    instance={this.state.instance}
                    instanceLoaded={this.state.instanceLoaded}
                />*/}
            </Container>
        );
    }
});

module.exports = ResetContainer;