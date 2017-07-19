import React from 'react';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';

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
                {
                    key: "code",
                    element: <Text 
                        label="Code"
                        value={option.code}
                    />,
                }
            );
        }
        if(defaults.title) {
            defaultsFields.push(
                {
                    key: "title",
                    element: <Text 
                        label="Title"
                        value={option.title}
                    />,
                }
            );
        }
        if(defaults.description) {
            defaultsFields.push(
                {
                    key: "description",
                    element: <Wysiwyg 
                        label="Description"
                        value={option.description}
                    />,
                }
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
                {
                    key: "places",
                    element: <Text 
                        label="Places"
                        value={content}
                    />,
                }
            );
        }
        if(defaults.points) {
            defaultsFields.push(
                {
                    key: "points",
                    element: <Text 
                        label="Points"
                        value={option.points}
                    />,
                }
            );
        }
    
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

module.exports = DefaultFields;