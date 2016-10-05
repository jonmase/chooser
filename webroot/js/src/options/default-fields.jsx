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
            var field = {
                label: "Code",
                value: option.code,
            };
            defaultsFields.push(
                <Text field={field} key="code" />
            );
        }
        if(defaults.title) {
            var field = {
                label: "Title",
                value: option.title,
            };
            defaultsFields.push(
                <Text field={field} key="title" />
            );
        }
        if(defaults.description) {
            var field = {
                label: "Description",
                value: option.description,
            };
            defaultsFields.push(
                <Wysiwyg field={field} key="description" />
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
                <Text field={field} key="places" />
            );
        }
        if(defaults.points) {
            var field = {};
            var field = {
                label: "Points",
                value: option.points,
            };
            defaultsFields.push(
                <Number field={field} key="points" />
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