import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {red500, orange500, indigo500} from 'material-ui/styles/colors';

var WarningIcon = React.createClass({
    render: function() {
        var icon = 'warning';
        
        var style = {verticalAlign: 'middle'};
        
        
        if(this.props.colour === "red") {
            style.color = red500;
        }
        else if(this.props.colour === "orange") {
            style.color = orange500;
        }
        else if(this.props.colour === "indigo") {
            style.color = indigo500;
        }
        
        if(this.props.large) {
            style.fontSize = 36;
        }
        else {
            style.fontSize = 20;
        }
        
        return (
            <FontIcon className="material-icons" title="Warning" style={style}>{icon}</FontIcon>
        );
    }
});

module.exports = WarningIcon;