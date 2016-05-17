import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Formsy from 'formsy-react';

import AddField from './add-field.jsx';
import TextField from '../fields/text.jsx';
import NumericField from '../fields/numeric.jsx';
import EmailField from '../fields/email.jsx';
import UrlField from '../fields/url.jsx';
import Wysiwyg from '../fields/wysiwyg.jsx';
import RadioField from '../fields/radio.jsx';
import CheckboxField from '../fields/checkbox.jsx';
import DropdownField from '../fields/dropdown.jsx';

var ExtraFields = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
            >
                <CardHeader
                    title="Extra Fields"
                    subtitle="Add custom fields to the options form for this Choice"
                >
                    <div style={{float: 'right'}}>
                        <AddField 
                            state={this.props.state} 
                            handlers={this.props.handlers} 
                        />
                    </div>
                </CardHeader>
                <CardText>
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        {this.props.state.extraFields.map(function(field) {
                            field.section = true;
                            switch(field.type) {
                                case 'text': 
                                    return (
                                        <TextField
                                            field={field}
                                            key={field.label}
                                            //label={field.label}
                                            //hint={field.instructions}
                                            //name={field.label}
                                            //required={field.required}
                                            //section={true}
                                        />
                                    );
                                    break;
                                case 'wysiwyg': 
                                    return (
                                        <Wysiwyg
                                            key={field.label}
                                            label={field.label}
                                            sublabel={field.instructions}
                                            container={field.label}
                                            required={field.required}
                                            section={true}
                                        />
                                    );
                                    break;
                                case 'number': 
                                    return (
                                        <NumericField
                                            field={field}
                                            key={field.label}
                                            //label={field.label}
                                            //hint={field.instructions}
                                            //name={field.label}
                                            //required={field.required}
                                            //section={true}
                                        />
                                    );
                                    break;
                                case 'email': 
                                    return (
                                        <EmailField
                                            key={field.label}
                                            label={field.label}
                                            hint={field.instructions}
                                            name={field.label}
                                            required={field.required}
                                            section={true}
                                        />
                                    );
                                    break;
                                case 'url': 
                                    return (
                                        <UrlField
                                            key={field.label}
                                            label={field.label}
                                            hint={field.instructions}
                                            name={field.label}
                                            required={field.required}
                                            section={true}
                                        />
                                    );
                                    break;
                                case 'radio': 
                                    return (
                                        <RadioField
                                            key={field.label}
                                            label={field.label}
                                            sublabel={field.instructions}
                                            name={field.label}
                                            options={field.extra_field_options}
                                            required={field.required}
                                        />
                                    );
                                    break;
                                case 'checkbox': 
                                    return (
                                        <CheckboxField
                                            key={field.label}
                                            label={field.label}
                                            sublabel={field.instructions}
                                            name={field.label}
                                            options={field.extra_field_options}
                                        />
                                    );
                                    break;
                                case 'dropdown': 
                                    return (
                                        <DropdownField
                                            key={field.label}
                                            label={field.label}
                                            sublabel={field.instructions}
                                            name={field.label}
                                            options={field.extra_field_options}
                                            required={field.required}
                                        />
                                    );
                                    break;
                                default:
                                    return (
                                        <div key={field.label}>{field.type}: {field.label}</div>
                                    );
                                    break;
                            }
                        })}
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = ExtraFields;