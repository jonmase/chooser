import React from 'react';

import Text from '../display/text.jsx';
import Numeric from '../display/numeric.jsx';
import Email from '../display/email.jsx';
import Url from '../display/url.jsx';
import Wysiwyg from '../display/wysiwyg.jsx';
import Radio from '../display/radio.jsx';
import Checkbox from '../display/checkbox.jsx';
import Dropdown from '../display/dropdown.jsx';
import DateTime from '../display/datetime.jsx';
//import Person from '../display/person.jsx';
//import File from '../display/file.jsx';

var ExtraField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        //For some reason, setting field.value in option-view-dialog.jsx did not work for the edit page, so passing as separate prop and adding to field here
        if(this.props.value) {
            field.value = this.props.value;
        }
        
        var props = {
            field: field,
        };
        
        var fieldComponent = null;
        switch(field.type) {
            case 'text': 
                fieldComponent = <Text {...props} />;
                break;
            case 'wysiwyg': 
                fieldComponent = <Wysiwyg {...props} />;
                break;
            case 'number': 
                fieldComponent = <Numeric {...props} />;
                break;
            case 'email': 
                fieldComponent = <Email {...props} />;
                break;
            case 'url': 
                fieldComponent = <Url {...props} />;
                break;
            case 'list':
                switch(field.extra.list_type) {
                    case 'radio': 
                        fieldComponent = <Radio {...props} />;
                        break;
                    case 'checkbox': 
                        fieldComponent = <Checkbox {...props} />;
                        break;
                    case 'dropdown': 
                        fieldComponent = <Dropdown {...props} />;
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
                fieldComponent = <DateTime {...props} />;
                break;
           /*case 'person':
                fieldComponent = <Person {...props} />;
                break;
            case 'file':
                fieldComponent = <File {...props} />;
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