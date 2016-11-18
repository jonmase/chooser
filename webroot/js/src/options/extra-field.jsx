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
        var displayProps = {
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
            <div>
                {(ComponentClass)?
                    <ComponentClass {...displayProps} />
                :
                    <span>-</span>
                }
            </div>
        );
    }
});

module.exports = ExtraField;