import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import EditSettings from './edit-settings.jsx';
import EditSettingsRaised from './edit-settings-raised.jsx';
import SettingsDialog from './settings-dialog.jsx';

import Text from '../display/text.jsx';
import Wysiwyg from '../display/wysiwyg.jsx';
import Numeric from '../display/numeric.jsx';
import DateTime from '../display/datetime.jsx';
import Toggle from '../display/toggle.jsx';

import Loader from '../elements/loader.jsx';

var Settings = React.createClass({
    render: function() {
        var instance = this.props.state.instance;
    
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
                    {!this.props.state.instanceLoaded?
                        <Loader />
                    :
                        !this.props.state.instance.id?
                            <div>
                                <p>This Choice has not been set up yet.</p>
                                <EditSettingsRaised handlers={this.props.handlers} />
                            </div>
                        :
                            <div>
                                <Wysiwyg field={{label: "Instructions", value: instance.choosing_instructions}} />
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                        <DateTime field={{label: "Opens", value: instance.opens}} />
                                        <DateTime field={{label: "Deadline", value: instance.deadline}} />
                                        <DateTime field={{label: "Extension", value: instance.extension}} />
                                        <Toggle field={{
                                            label: "Editable", 
                                            value: instance.editable, 
                                            explanation: instance.editable?"Students can edit choices up until the deadline":"Students cannot edit choices after submission",
                                            explanation: "Students can" + (instance.preference?" edit choices up until the deadline":"not edit choices after submission"),
                                        }} />
                                    </div>
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle field={{
                                            label: "Preferences", 
                                            value: instance.preference, 
                                            explanation: "Students can" + (instance.preference?((instance.preference_type === 'rank')?" rank":((instance.preference_type === 'points')?" assign points to":"")):"not express preferences for") + " options",
                                        }} />
                                        {instance.preference?
                                            <div>
                                                {instance.preference_points?
                                                    <Text field={{label: "Points Available", value: instance.preference_points}} />
                                                :""}
                                                <Wysiwyg field={{label: "Instructions", value: instance.preference_instructions}} />
                                            </div>
                                        :""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle field={{
                                            label: "Overall Comments", 
                                            value: instance.comments_overall, 
                                            explanation: "Students can" + (instance.comments_overall?"":"not") + " make comments about their choice as a whole",
                                        }} />
                                        {instance.comments_overall?
                                            <div>
                                                {instance.comments_overall_limit?
                                                    <Text field={{label: "Character Limit", value: instance.comments_overall_limit}} />
                                                :""}
                                                <Wysiwyg field={{label: "Instructions", value: instance.comments_overall_instructions}} />
                                            </div>
                                        :""}
                                    </div>
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle field={{
                                            label: "Comments Per Option", 
                                            value: instance.comments_per_option, 
                                            explanation: "Students can" + (instance.comments_per_option?"":"not") + " make separate comments about each option they have chosen",
                                        }} />
                                        {instance.comments_per_option?
                                            <div>
                                                {instance.comments_per_option_limit?
                                                    <Text field={{label: "Character Limit", value: instance.comments_per_option_limit}} />
                                                :""}
                                                <Wysiwyg field={{label: "Instructions", value: instance.comments_per_option_instructions}} />
                                            </div>
                                        :""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                    </div>
                                </div>
                            </div>
                    }
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