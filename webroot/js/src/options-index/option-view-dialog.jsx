import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import DefaultFields from './default-fields.jsx';
import ExtraField from './extra-field.jsx';


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

        return (
            <Dialog
                actions={actions}
                modal={false}
                onRequestClose={this.props.handlers.dialogClose}
                open={this.props.viewState.optionDialogOpen}
                style={customDialogStyle}
                title={title}
            >

                <DefaultFields
                    defaults={defaults}
                    option={optionBeingViewed}
                />
                
                {this.props.choice.extra_fields.map(function(field) {
                    if(optionBeingViewed && typeof(optionBeingViewed[field.name]) !== "undefined") {
                        field.value = optionBeingViewed[field.name];
                    }
                    else {
                        //delete field.value;
                        field.value = '';
                    }

                
                    return (
                        <ExtraField
                            key={field.id}
                            field={field}
                        />
                    );
                }, this)}

            </Dialog>
        );
    }
});

module.exports = OptionViewDialog;