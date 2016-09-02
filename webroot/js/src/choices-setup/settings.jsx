import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import EditSettings from './edit-settings.jsx';
import SettingsDialog from './settings-dialog.jsx';

var Settings = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    actAsExpander={false}
                    showExpandableButton={false}
                    subtitle="Provide instructions, deadlines, and other options"
                    title="Settings"
                >
                    <div style={{float: 'right'}}>
                        <EditSettings
                            handlers={this.props.handlers}
                        />
                    </div>
                </CardHeader>
                <CardText 
                    expandable={false}
                >
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            Some settings
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            More settings
                        </div>
                    </div>
                </CardText>
                <SettingsDialog
                    choice={this.props.choice}
                    handlers={this.props.handlers}
                    state={this.props.state}
                />
            </Card>
        );
    }
});

module.exports = Settings;