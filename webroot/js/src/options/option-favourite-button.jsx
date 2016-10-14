import React from 'react';
import IconButton from 'material-ui/IconButton';

var styles = {
    iconStyle: {
        color: 'rgb(158,158,158)'
    },
}

var FavouriteOption = React.createClass({
    handleAddFavourite: function() {
        this.props.handler(this.props.optionId, 'add');
    },
    handleRemoveFavourite: function() {
        this.props.handler(this.props.optionId, 'remove');
    },
    render: function() {
        return (
            <span>
                {(this.props.favourited)?
                    <IconButton
                        onTouchTap={this.handleRemoveFavourite}
                        iconClassName="material-icons"
                        iconStyle={styles.iconStyle}
                    >
                        star
                    </IconButton>         
                :
                    <IconButton
                        onTouchTap={this.handleAddFavourite}
                        iconClassName="material-icons"
                        iconStyle={styles.iconStyle}
                    >
                        star_border
                    </IconButton>
                }
            </span>
        );
    }
});

module.exports = FavouriteOption;