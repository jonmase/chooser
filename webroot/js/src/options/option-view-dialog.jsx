import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import DefaultFields from './default-fields.jsx';
import ExtraFieldLabelled from './extra-field-labelled.jsx';


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
        
        var option = {};
        if(this.props.optionBeingViewed) {
            option = this.props.options.options[this.props.options.indexesById[this.props.optionBeingViewed]];
        }
        
        var title = '';
        if(typeof(option) !== "undefined" && option) {
            if(option.code) {
                title += option.code;
                if(option.title) {
                    title += ": ";
                }
            }
            if(option.title) {
                title += option.title;
            }
        }

        return (
            <Dialog
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.handlers.dialogClose}
                open={this.props.dialogOpen}
                style={customDialogStyle}
                title={title}
            >

                <DefaultFields
                    defaults={defaults}
                    option={option}
                />
                
                {this.props.choice.extra_fields.map(function(field) {
                    var value = null;
                    if(option && typeof(option[field.name]) !== "undefined") {
                        value = option[field.name];
                    }
                
                    return (
                        <ExtraFieldLabelled
                            explanation={field.explanation}
                            extra={field.extra}
                            //field={field}
                            key={field.id}
                            label={field.label}
                            options={field.options}
                            type={field.type}
                            value={value}
                        />
                    );
                }, this)}

            </Dialog>
        );
    }
});

module.exports = OptionViewDialog;