import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

var ResetContainer = React.createClass({
    getInitialState: function () {
        return {
            saveButtonEnabled: true,
            saveButtonLabel: 'Reset',
        };
    },
    componentDidMount: function() {
    },
    
    handleResetClick: function() {
    
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={<RaisedButton 
                //disabled={!this.state.canSubmit && this.state.saveButtonEnabled}
                label={this.state.saveButtonLabel}
                onTouchTap={this.handleResetClick}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Reset Choice"} />}
        />;
        
        return (
            <Container topbar={topbar} title={false}>
            </Container>
        );
    }
});

module.exports = ResetContainer;