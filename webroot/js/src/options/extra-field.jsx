import React from 'react';

import Text from '../elements/display/text.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import Email from '../elements/display/email.jsx';
import Url from '../elements/display/url.jsx';
import Checkbox from '../elements/display/checkbox.jsx';
import DateTime from '../elements/display/datetime.jsx';
//import Person from '../elements/display/person.jsx';
//import File from '../elements/display/file.jsx';

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
        
        var ComponentClass = null;
        switch(field.type) {
            case 'text':
                ComponentClass = Text;
                break;
            case 'wysiwyg': 
                ComponentClass = Wysiwyg;
                break;
            case 'number': 
                ComponentClass = Text;
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
                        ComponentClass = Text;
                        break;
                    case 'checkbox': 
                        ComponentClass = Checkbox;
                        break;
                    case 'dropdown': 
                        ComponentClass = Text;
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
                    <span>-</span>
                }
            </div>
        );
    }
});

module.exports = ExtraField;