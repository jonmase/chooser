import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FieldsWrapper from '../elements/wrappers/fields.jsx';
import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';

var DefaultFieldToggles = React.createClass({
    render: function() {
        var defaultsField = this.props.getDefaultFields(['title']);     //Get defaults, excluding title
        var toggleNodes = [];
        
        var toggleNodes = defaultsField.map(function(field) {
            return (
                <FormsyToggle
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    defaultToggled={this.props.choice['use_' + field.name]}
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
                    subtitle="Change which of the default fields are used for this Choice. Title is always used."
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
                                    label={this.props.defaultsButton.label} 
                                    primary={true} 
                                    type="submit"
                                    disabled={this.props.defaultsButton.disabled}
                                />
                            </Formsy.Form>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <Formsy.Form
                                id="form_defaults_preview_form"
                                method="POST"
                            >
                                <DefaultFields
                                    choice={this.props.choice}
                                />
                            </Formsy.Form>
                        </div>
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = FieldsWrapper(DefaultFieldToggles);