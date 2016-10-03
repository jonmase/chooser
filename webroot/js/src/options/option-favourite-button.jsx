import React from 'react';
import IconButton from 'material-ui/IconButton';

var FavouriteOption = React.createClass({
    handleAddFavourite: function() {
        this.props.handlers.addFavourite(this.props.option.id);
    },
    handleRemoveFavourite: function() {
        this.props.handlers.removeFavourite(this.props.option.id);
    },
    render: function() {
        return (
            <span>
                <IconButton
                    onTouchTap={this.handleAddFavourite}
                    iconClassName="material-icons"
                    iconStyle={{color: 'rgb(158,158,158)'}}
                >
                    star_border
                </IconButton>         
                {/*<IconButton
                    onTouchTap={this.handleRemoveFavourite}
                    iconClassName="material-icons"
                >
                    star
                </IconButton>*/}
            </span>
        );
    }
});

module.exports = FavouriteOption;