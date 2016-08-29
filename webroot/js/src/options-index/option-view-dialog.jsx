import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import ShortTextDisplay from '../display/short-text.jsx';
import LongTextDisplay from '../display/long-text.jsx';
import MinMaxDisplay from '../display/min-max.jsx';


var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionViewDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="close"
                label="Close"
                secondary={false}
                onTouchTap={this.props.handlers.dialogClose}
            />,
        ];
        
        var defaults = {
            code: this.props.choice.use_code,
            title: this.props.choice.use_title,
            description: this.props.choice.use_description,
            min_places: this.props.choice.use_min_places,
            max_places: this.props.choice.use_max_places,
            points: this.props.choice.use_points,
        };
        
        var optionBeingViewed = this.props.viewState.optionBeingViewed;
        
        var title = '';
        if(typeof(optionBeingViewed) !== "undefined" && optionBeingViewed) {
            if(optionBeingViewed.code) {
                title += optionBeingViewed.code;
                if(optionBeingViewed.title) {
                    title += ": ";
                }
            }
            if(optionBeingViewed.title) {
                title += optionBeingViewed.title;
            }
        }

        if(optionBeingViewed) {
            return (
                <Dialog
                    actions={actions}
                    modal={false}
                    onRequestClose={this.props.handlers.dialogClose}
                    open={this.props.viewState.optionDialogOpen}
                    style={customDialogStyle}
                    title={title}
                >
                    {(optionBeingViewed.code)?
                        <ShortTextDisplay title="Code" content={optionBeingViewed.code} />
                    :""}
                    {(optionBeingViewed.title)?
                        <ShortTextDisplay title="Title" content={optionBeingViewed.title} />
                    :""}
                    {(optionBeingViewed.description)?
                        <LongTextDisplay title="Description" content={optionBeingViewed.description} />
                    :""}
                    {(optionBeingViewed.min_places || optionBeingViewed.max_places)?
                        <MinMaxDisplay title="Places" min={optionBeingViewed.min_places} max={optionBeingViewed.max_places} />
                    :""}
                    {(optionBeingViewed.points)?
                        <ShortTextDisplay title="Points" content={optionBeingViewed.points} />
                    :""}
                    
                </Dialog>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = OptionViewDialog;