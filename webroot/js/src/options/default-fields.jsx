import React from 'react';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';
import Number from '../elements/display/number-labelled.jsx';


var DefaultFields = React.createClass({
    render: function() {
        var defaults = this.props.defaults;
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        var defaultsFields = [];
        if(defaults.code) {
            defaultsFields.push(
                <Text 
                    key="code" 
                    label="Code"
                    value={option.code}
                />
            );
        }
        if(defaults.title) {
            defaultsFields.push(
                <Text 
                    key="title" 
                    label="Title"
                    value={option.title}
                />
            );
        }
        if(defaults.description) {
            defaultsFields.push(
                <Wysiwyg 
                    key="description" 
                    label="Description"
                    value={option.description}
                />
            );
        }
        if(defaults.min_places || defaults.max_places) {
            if(option.min_places && option.max_places) {
                var content = option.min_places + " to " + option.max_places;
            }
            else if(option.min_places) {
                var content = "At least " + option.min_places;
            }
            else if(option.max_places) {
                var content = "Up to " + option.max_places;
            }
            else {
                var content = "";
            }
            
            defaultsFields.push(
                <Text 
                    key="places" 
                    label="Places"
                    value={content}
                />
            );
        }
        if(defaults.points) {
            defaultsFields.push(
                <Number
                    key="points" 
                    label="Points"
                    value={option.points}
                />
            );
        }
    
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

module.exports = DefaultFields;