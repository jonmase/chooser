import React from 'react';

import FieldsWrapper from '../elements/wrappers/fields.jsx';
import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';

var DefaultFields = React.createClass({
    render: function() {
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        var defaultsFields = this.props.getDefaultFieldsForChoice(this.props.choice);
        
        var defaultFieldComponents = [];
        
        defaultsFields.forEach(function(field) {
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
                default: 
                    ComponentClass = null;
                    break;
            }
            
            defaultFieldComponents.push(
                {
                    key: field.name,
                    element: <ComponentClass 
                        label={field.label}
                        paragraph={true}
                        value={option[field.name]}
                    />
                }
            );
        }, this);
        
        return (
            <div>
                {defaultFieldComponents.map(function(field) {
                    return(
                        <div key={field.key}>{field.element}</div>
                    );
                })}
            </div>
        );
    }
});

module.exports = FieldsWrapper(DefaultFields);