import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';
import RaisedButton from 'material-ui/RaisedButton';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import DefaultFields from '../option-fields/default-fields.jsx';

var DefaultFieldToggles = React.createClass({
    render: function() {
        var toggles = [
            {
                name: "code",
                label: "Code",
                defaultToggled: this.props.choice.use_code,
            },
            {
                name: "title",
                label: "Title",
                defaultToggled: this.props.choice.use_title,
            },
            {
                name: "description",
                label: "Description",
                defaultToggled: this.props.choice.use_description,
            },
            {
                name: "min_places",
                label: "Minimum Places",
                defaultToggled: this.props.choice.use_min_places,
            },
            {
                name: "max_places",
                label: "Maximum Places",
                defaultToggled: this.props.choice.use_max_places,
            },
            {
                name: "points",
                label: "Points",
                defaultToggled: this.props.choice.use_points,
            },
        ];
        
        var toggleNodes = toggles.map(function(toggle) {
            return (
                <FormsyToggle
                    key={toggle.name}
                    name={toggle.name}
                    label={toggle.label}
                    defaultToggled={toggle.defaultToggled}
                    labelPosition="right"
                    onChange={this.props.handlers.change}
                />
            );
        }, this);

    
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Default Fields"
                    subtitle="Change which of the default fields are used for this Choice"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                >
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <Formsy.Form
                                id="form_defaults_form"
                                method="POST"
                                onValidSubmit={this.props.handlers.submit}
                                //onChange={this.props.handlers.change}
                            >
                                <div className="section">
                                    {toggleNodes}
                                </div>
                                <RaisedButton 
                                    label={this.props.state.defaultsButton.label} 
                                    primary={true} 
                                    type="submit"
                                    disabled={this.props.state.defaultsButton.disabled}
                                />
                            </Formsy.Form>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <Formsy.Form
                                id="form_defaults_preview_form"
                                method="POST"
                            >
                                <DefaultFields
                                    defaults={this.props.state.defaults}
                                    removeOrHide="hide"
                                />
                            </Formsy.Form>
                        </div>
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = DefaultFieldToggles;