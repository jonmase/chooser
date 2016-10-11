import React from 'react';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';
import Number from '../elements/display/number-labelled.jsx';
import Email from '../elements/display/email-labelled.jsx';
import Url from '../elements/display/url-labelled.jsx';
import Radio from '../elements/display/radio-labelled.jsx';
import Checkbox from '../elements/display/checkbox-labelled.jsx';
import Dropdown from '../elements/display/dropdown-labelled.jsx';
import DateTime from '../elements/display/datetime-labelled.jsx';
//import Person from '../elements/display/person-labelled.jsx';
//import File from '../elements/display/file-labelled.jsx';

var ExtraField = React.createClass({
    render: function() {
        //var field = this.props.field;
        
        //For some reason, setting field.value in option-view-dialog.jsx did not work for the edit page, so passing as separate prop and adding to field here
        //if(this.props.value) {
        //    field.value = this.props.value;
        //}
        
        //var props = {
        //    field: field,
        //};
        
        var time = false;
        
        var ComponentClass = null;
        switch(this.props.type) {
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
                switch(this.props.extra.list_type) {
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
                time = true;
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
                    <ComponentClass {...this.props} time={time} />
                :
                    (this.props.type === 'list')?
                        <div>Could not display list field ({this.props.extra.list_type}: {this.props.label})</div>
                    :
                        <div>Could not display field ({this.props.type}: {this.props.label})</div>
                }
            </div>
        );
    }
});

module.exports = ExtraField;