import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Slider, { Range } from 'rc-slider';
import {indigo500} from 'material-ui/styles/colors';


import FormsyDialog from '../elements/formsy-dialog.jsx';
import Radio from '../elements/fields/radio.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionFilterDialog = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            points: [this.props.filterValues.points.min, this.props.filterValues.points.max],
        };
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },
    
    getSliderMarks: function(field) {
        var min = this.props.filterValues[field].min;
        var max = this.props.filterValues[field].max;
        var diff = max - min;
        var step = 1;
        
        if(diff > 10) {
            step = 2;
        }
        if(diff > 20) {
            step = 5;
        }
        if(diff > 50) {
            step = 10;
        }
        if(diff > 100) {
            step = 20;
        }
            
        var marks = {};
        for(var i = min; i <= max; i+= step) {
            marks[i] = i;
        };
        return marks;
    },
    
    handleClear: function() {
        console.log("Clear all filter");
    },
    
    handlePointsChange: function(value) {
        this.setState({points: value});
    },

    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="clear"
                label="Clear"
                secondary={true}
                onTouchTap={this.handleClear}
            />,
            <FlatButton
                key="submit"
                label="Filter"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.dialogOpen}
                dialogTitle="Filter Options"
                formId="option_filter_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <Radio 
                    field={{
                        instructions: "",
                        label: "Selected",
                        name: "selected",
                        options: [
                            {
                                label: "All",
                                value: "all",
                            },
                            {
                                label: "Selected only",
                                value: "selected",
                            },
                            {
                                label: "Unselected only",
                                value: "unselected",
                            },
                        ],
                        section: true,
                        value: "all",
                    }}
                />
                
                {/*<Radio 
                    field={{
                        instructions: "",
                        label: "Favourites",
                        name: "favourites",
                        options: [
                            {
                                label: "All",
                                value: "all",
                            },
                            {
                                label: "Favourites only",
                                value: "favourites",
                            },
                            {
                                label: "Non Favourites only",
                                value: "nonfavourites",
                            },
                        ],
                        section: true,
                        value: "all",
                    }}
                />*/}
                
                {this.props.choice.use_points &&
                    <div className="section" style={{paddingRight: '10%'}}>
                        <label>Points: <span>{this.state.points[0]} to {this.state.points[1]}</span></label>
                        <Range 
                            allowCross={true}
                            marks={this.getSliderMarks('points')}
                            max={this.props.filterValues.points.max}
                            min={this.props.filterValues.points.min}
                            onChange={this.handlePointsChange} 
                            trackStyle={[{backgroundColor: indigo500}]}
                            handleStyle={[{borderColor: indigo500}, {borderColor: indigo500}]}
                            activeDotStyle={{borderColor: indigo500}}
                            value={this.state.points}
                        />
                    </div>
                }
                
                //All filterable field types - numerical, lists, date ranges
                
            </FormsyDialog>
        );
    }
});

module.exports = OptionFilterDialog;