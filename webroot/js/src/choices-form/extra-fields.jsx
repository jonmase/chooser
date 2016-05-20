import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

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
import DateTimeField from '../fields/datetime.jsx';
import PersonField from '../fields/person.jsx';
import FileField from '../fields/file.jsx';

import CategoryIcon from '../icons/category.jsx';
import FilterableIcon from '../icons/filterable.jsx';
import RequiredIcon from '../icons/required.jsx';
import ShowToStudentsIcon from '../icons/show-to-students.jsx';
import SortableIcon from '../icons/sortable.jsx';
import UserDefinedFormIcon from '../icons/user-defined-form.jsx';

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
                            var fieldComponent = null;
                            
                            field.section = true;
                            switch(field.type) {
                                case 'text': 
                                    fieldComponent = <TextField field={field} />;
                                    break;
                                case 'wysiwyg': 
                                    fieldComponent = <Wysiwyg field={field} />;
                                    break;
                                case 'number': 
                                    fieldComponent = <NumericField field={field} />;
                                    break;
                                case 'email': 
                                    fieldComponent = <EmailField field={field} />;
                                    break;
                                case 'url': 
                                    fieldComponent = <UrlField field={field} />;
                                    break;
                                case 'radio': 
                                    fieldComponent = <RadioField field={field} />;
                                    break;
                                case 'checkbox': 
                                    fieldComponent = <CheckboxField field={field} />;
                                    break;
                                case 'dropdown': 
                                    fieldComponent = <DropdownField field={field} />;
                                    break;
                                case 'datetime': 
                                    var time = true;
                                case 'date': 
                                    fieldComponent = <DateTimeField field={field} time={time} />;
                                    break;
                                case 'person':
                                    fieldComponent = <PersonField field={field} />;
                                    break;
                                case 'file':
                                    fieldComponent = <FileField field={field} />;
                                    break;
                                default:
                                    fieldComponent = 
                                        <div>Count not display field ({field.type}: {field.label})</div>;
                                    break;
                            }
                            
                            return (
                                <div className="row" key={field.label}>
                                    <div className="col-xs-6 col-md-9 col-lg-10">
                                        {fieldComponent}
                                    </div>
                                    <div className="col-xs-3 col-md-2 col-lg-1" style={{margin: 'auto', textAlign: 'right'}}>
                                        {field.required?<RequiredIcon />:''}
                                        {field.show_to_students?<ShowToStudentsIcon />:''}
                                        {field.in_user_defined_form?<UserDefinedFormIcon />:''}
                                        {field.sortable?<SortableIcon />:''}
                                        {field.filterable?<FilterableIcon />:''}
                                        {field.rule_category?<CategoryIcon />:''}
                                    </div>
                                    <div className="col-xs-3 col-md-1" style={{margin: 'auto', textAlign: 'right'}}>
                                        <IconButton tooltip={'Edit ' + field.label + ' Field'}>
                                            <FontIcon className="material-icons">edit</FontIcon>
                                        </IconButton>
                                        <IconButton tooltip={'Delete ' + field.label + ' Field'}>
                                            <FontIcon className="material-icons">delete</FontIcon>
                                        </IconButton>
                                    </div>
                                </div>
                            );
                        })}
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = ExtraFields;