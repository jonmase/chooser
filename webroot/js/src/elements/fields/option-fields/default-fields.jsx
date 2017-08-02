import React from 'react';

import Code from './code.jsx';
import Title from './title.jsx';
import Description from './description.jsx';
import MinPlaces from './min_places.jsx';
import MaxPlaces from './max_places.jsx';
import Points from './points.jsx';


var DefaultFields = React.createClass({
    render: function() {
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        var defaultsFieldComponents = [];
        this.props.defaultFields.forEach(function(field) {
            var ComponentClass = null;
            switch(field.name) {
                case 'code':
                    ComponentClass = Code;
                    break;
                case 'title': 
                    ComponentClass = Title;
                    break;
                case 'description': 
                    ComponentClass = Description;
                    break;
                case 'min_places':
                    ComponentClass = MinPlaces;
                    break;
                case 'max_places': 
                    ComponentClass = MaxPlaces;
                    break;
                case 'points': 
                    ComponentClass = Points;
                    break;
                default: 
                    ComponentClass = null;
                    break;
            }
            
            var onBlur = null;
            var onChange = null;
            var onFocus = null;
            
            //If field is description, i.e. WYSIWYG
            if(field.name === 'description') {
                //If field is WYSIWYG, add editor to state and assume it is changed on focus 
                onFocus = this.props.onWysiwygFocus;
            }
            //If this is a text type field, i.e. where user will be typing, assume it is changed on focus
            else if(field.name === 'code' || field.name === 'title') {
                onFocus = this.props.onChange;
            }
            //Otherwise, set as changed when it changes
            else {
                onChange = this.props.onChange;
            }
            
            var style = null;
            if(field.name === 'description') {
                style = {marginTop: '20px'};
            }
            
            defaultsFieldComponents.push(
                <div key={field.name} style={style} >
                    <ComponentClass value={option?option[field.name]:""} onBlur={onBlur} onChange={onChange} onFocus={onFocus} />
                </div>
            );
        }, this);
        
        return (
            <div>
                {defaultsFieldComponents.map(function(field) {
                    return(
                        field
                    );
                })}
            </div>
        );
    }
});

module.exports = DefaultFields;