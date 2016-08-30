import React from 'react';

import Text from '../display/text.jsx';
import Wysiwyg from '../display/wysiwyg.jsx';
import Numeric from '../display/numeric.jsx';


var DefaultFields = React.createClass({
    render: function() {
        var defaults = this.props.defaults;
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        var defaultsFields = [];
        if(defaults.code) {
            var field = {
                label: "Code",
                value: option.code,
            };
            defaultsFields.push(
                <Text field={field} />
            );
        }
        if(defaults.title) {
            var field = {
                label: "Title",
                value: option.title,
            };
            defaultsFields.push(
                <Text field={field} />
            );
        }
        if(defaults.description) {
            var field = {
                label: "Description",
                value: option.description,
            };
            defaultsFields.push(
                <Wysiwyg field={field} />
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
            
            var field = {
                label: "Places",
                value: content,
            }
        
            defaultsFields.push(
                <Text field={field} />
            );
        }
        if(defaults.points) {
            var field = {};
            var field = {
                label: "Points",
                value: option.points,
            };
            defaultsFields.push(
                <Numeric field={field} />
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