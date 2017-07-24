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
        
        var allDefaults = this.props.allDefaultFields;
        
        var defaultsFields = [];
        
        var useMinPlaces = false;
        allDefaults.forEach(function(field) {
            if(this.props.choice['use_' + field.name]) {
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
                
                /*var key = field.name;
                var label = field.label;
                var value = option[field.name];
                if(field.name === 'min_places' || field.name === 'max_places') {
                    label = 'Places';
                    if(field.name === 'min_places') {
                        value = "At least " + option.min_places;
                        useMinPlaces = true;
                    }
                    else if(field.name === 'max_places') {
                        if(useMinPlaces) {
                            key = 'places';
                            value = option.min_places + " to " + option.max_places;
                            defaultsFields.pop(); //Pop min places off the defaultFields array
                        }
                        else {
                            value = "Up to " + option.max_places;
                        }
                    }
                }*/
                
                defaultsFields.push(
                    {
                        key: field.name,
                        element: <ComponentClass 
                            label={field.label}
                            paragraph={true}
                            value={option[field.name]}
                        />
                    }
                );
            }
        }, this);
        
        return (
            <div>
                {defaultsFields.map(function(field) {
                    return(
                        <div key={field.key}>{field.element}</div>
                    );
                })}
            </div>
        );
    }
});

module.exports = FieldsWrapper(DefaultFields);