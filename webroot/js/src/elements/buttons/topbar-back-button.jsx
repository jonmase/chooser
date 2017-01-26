import React from 'react';
import IconButton from 'material-ui/IconButton';

var BackButton = React.createClass({
    render: function() {
        var icon = 'arrow_back';
        
        var style = {color: 'white'};
        
        return (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={this.props.onTouchTap}
                iconStyle={style}
            >
                arrow_back
            </IconButton>
        );
    }
});

module.exports = BackButton;