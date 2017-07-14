import React from 'react';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';
import Email from '../elements/display/email-labelled.jsx';
import Url from '../elements/display/url-labelled.jsx';
import Checkbox from '../elements/display/checkbox-labelled.jsx';
import DateTime from '../elements/display/datetime-labelled.jsx';
//import Person from '../elements/display/person-labelled.jsx';
//import File from '../elements/display/file-labelled.jsx';

var ExtraField = React.createClass({
    render: function() {
        var displayProps = {
            label: this.props.label,
            paragraph: this.props.paragraph,
            time: false,
        };
    
        if(this.props.value) {
            displayProps.value = this.props.value;
        }
        
        var ComponentClass = null;
        switch(this.props.type) {
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
                switch(this.props.extra.list_type) {
                    case 'dropdown': 
                    case 'radio': 
                        ComponentClass = Text;
                        for(var i in this.props.options) {
                            if(displayProps.value === this.props.options[i].value) {
                                displayProps.value = this.props.options[i].label;
                                break;
                            }
                        }
                        break;
                    case 'checkbox': 
                        ComponentClass = Checkbox;
                        displayProps.options = this.props.options;
                        break;
                    default:
                        ComponentClass = null;
                        break;
                }
                break;
            case 'datetime': 
                displayProps.time = true;
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
            (ComponentClass)?
                <ComponentClass {...displayProps} />
            :
                (this.props.type === 'list')?
                    <div>Could not display list field ({this.props.extra.list_type}: {this.props.label})</div>
                :
                    <div>Could not display field ({this.props.type}: {this.props.label})</div>
            
        );
    }
});

module.exports = ExtraField;