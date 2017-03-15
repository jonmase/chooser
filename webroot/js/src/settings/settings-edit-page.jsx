import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import FieldLabel from '../elements/fields/label.jsx';
import Text from '../elements/fields/text.jsx';
import Multiline from '../elements/fields/multiline-text.jsx';
import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';

var SettingsPage = React.createClass({
    getInitialState: function () {
        return {
            commentsOverallToggle: false,
            commentsPerOptionToggle: false,
            preferenceToggle: false,
            preferenceType: 'rank',
            canSubmit: false,
        };
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },
    
    handleCommentsOverallChange: function(event, value) {
        this.setState({
            commentsOverallToggle: value
        });
    },

    handleCommentsPerOptionChange: function(event, value) {
        this.setState({
            commentsPerOptionToggle: value
        });
    },

    handlePreferenceChange: function(event, value) {
        this.setState({
            preferenceToggle: value
        });
    },

    handlePreferenceTypeChange: function(event, value) {
        this.setState({
            preferenceType: value
        });
    },

    render: function() {
        var instance = this.props.instance;
        
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit}
                label="Save"
                onTouchTap={this.handleSaveClick}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title="Edit Choice Settings"
        />;
        
        return (
            <Container topbar={topbar}>
                Everything goes here
                
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = SettingsPage