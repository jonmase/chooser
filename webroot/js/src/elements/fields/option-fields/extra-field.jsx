import React from 'react';

import TextField from '../text.jsx';
import NumericField from '../numeric.jsx';
import EmailField from '../email.jsx';
import UrlField from '../url.jsx';
import Wysiwyg from '../wysiwyg.jsx';
import RadioField from '../radio.jsx';
import CheckboxField from '../checkbox.jsx';
import DropdownField from '../dropdown.jsx';
import DateTimeField from '../datetime.jsx';
import PersonField from '../person.jsx';
import FileField from '../file.jsx';

var ExtraField = React.createClass({
    render: function() {
        var field = this.props.field;
        field.section = true;
        
        var props = {
            field: field,
        };
        
        var fieldComponent = null;
        switch(field.type) {
            case 'text': 
                fieldComponent = <TextField {...props} />;
                break;
            case 'wysiwyg': 
                fieldComponent = <Wysiwyg {...props} />;
                break;
            case 'number': 
                fieldComponent = <NumericField {...props} />;
                break;
            case 'email': 
                fieldComponent = <EmailField {...props} />;
                break;
            case 'url': 
                fieldComponent = <UrlField {...props} />;
                break;
            case 'list':
                switch(field.extra.list_type) {
                    case 'radio': 
                        fieldComponent = <RadioField {...props} />;
                        break;
                    case 'checkbox': 
                        fieldComponent = <CheckboxField {...props} />;
                        break;
                    case 'dropdown': 
                        fieldComponent = <DropdownField {...props} />;
                        break;
                    default:
                        fieldComponent = 
                            <div>Could not display list field ({field.extra.list_type}: {field.label})</div>;
                        break;
                }
                break;
            case 'datetime': 
                props.time = true;
            case 'date': 
                fieldComponent = <DateTimeField {...props} />;
                break;
            /*case 'person':
                fieldComponent = <PersonField {...props} />;
                break;
            case 'file':
                fieldComponent = <FileField {...props} />;
                break;*/
            default:
                fieldComponent = 
                    <div>Could not display field ({field.type}: {field.label})</div>;
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