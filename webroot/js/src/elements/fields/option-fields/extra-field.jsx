import React from 'react';

import Text from '../text.jsx';
import Wysiwyg from '../wysiwyg.jsx';
import Number from '../number.jsx';
import Email from '../email.jsx';
import Url from '../url.jsx';
import Radio from '../radio.jsx';
import Checkbox from '../checkbox.jsx';
import Dropdown from '../dropdown.jsx';
import DateTime from '../datetime.jsx';
import Person from '../person.jsx';
import File from '../file.jsx';

var ExtraField = React.createClass({
    render: function() {
        var field = this.props.field;
        field.section = true;
        
        var props = {
            field: field,
        };
        
        var ComponentClass = null;
        switch(field.type) {
            case 'text': 
                ComponentClass = Text;
                break;
            case 'wysiwyg': 
                ComponentClass = Wysiwyg;
                break;
            case 'number': 
                ComponentClass = Number;
                break;
            case 'email': 
                ComponentClass = Email;
                break;
            case 'url': 
                ComponentClass = Url;
                break;
            case 'list':
                switch(field.extra.list_type) {
                    case 'radio': 
                        ComponentClass = Radio;
                        break;
                    case 'checkbox': 
                        ComponentClass = Checkbox;
                        break;
                    case 'dropdown': 
                        ComponentClass = Dropdown;
                        break;
                    default:
                        ComponentClass = null;
                        break;
                }
                break;
            case 'datetime': 
                props.time = true;
            case 'date': 
                ComponentClass = DateTime;
                break;
            /*case 'person':
                ComponentClass = Person;
                break;
            case 'file':
                ComponentClass = File;
                break;*/
            default:
                ComponentClass = null;
                break;
        }

        return (
            <div>
                {(ComponentClass)?
                    <ComponentClass {...props} />
                :
                    (field.type === 'list')?
                        <div>Could not display list field ({field.extra.list_type}: {field.label})</div>
                    :
                        <div>Could not display field ({field.type}: {field.label})</div>
                }
            </div>
        );
    }
});

module.exports = ExtraField;