import React from 'react';

import FieldsWrapper from '../../wrappers/fields.jsx';

import Code from './code.jsx';
import Title from './title.jsx';
import Description from './description.jsx';
import MinPlaces from './min_places.jsx';
import MaxPlaces from './max_places.jsx';
import Points from './points.jsx';


var DefaultFields = React.createClass({
    render: function() {
        var defaults = this.props.defaults;
        var allDefaults = this.props.allDefaultFields;
        
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        //Remove or hide the fields that are not being used?
        var remove = (this.props.removeOrHide === 'remove')?true:false;
        var useDefaults = {};
        allDefaults.forEach(function(field) {
            if(this.props.choice['use_' + field.name]) {
                useDefaults[field.name] = true;
            }
            else {
                useDefaults[field.name] = false;
            }
        }, this);
        
        var defaultsFields = [];
        allDefaults.forEach(function(field) {
            if(!remove || useDefaults[field.name]) {
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
                
                if(field.type === "wysiwyg") {
                    var onChange = this.props.onWysiwygChange;
                }
                else {
                    var onChange = this.props.onChange;
                }
                
                var style = null;
                if(field.name === 'description') {
                    style = {marginTop: '20px'};
                }
                
                defaultsFields.push(
                    <div className={useDefaults[field.name]?'':'hidden'} key={field.name} style={style} >
                        <ComponentClass value={option?option[field.name]:""} onChange={onChange} />
                    </div>
                );
            }
        }, this);
        
        return (
            <div>
                {defaultsFields.map(function(field) {
                    return(
                        field
                    );
                })}
            </div>
        );
    }
});

module.exports = FieldsWrapper(DefaultFields);