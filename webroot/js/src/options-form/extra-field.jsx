import React from 'react';

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

var ExtraField = React.createClass({
    render: function() {
        var field = this.props.field;
        field.section = true;
        
        var fieldComponent = null;
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
            case 'list':
                switch(field.extra.list_type) {
                    case 'radio': 
                        fieldComponent = <RadioField field={field} />;
                        break;
                    case 'checkbox': 
                        fieldComponent = <CheckboxField field={field} />;
                        break;
                    case 'dropdown': 
                        fieldComponent = <DropdownField field={field} />;
                        break;
                    default:
                        fieldComponent = 
                            <div>Count not display list field ({field.extra.list_type}: {field.label})</div>;
                        break;
                }
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
            <div>
                {fieldComponent}
            </div>
        );
    }
});

module.exports = ExtraField;