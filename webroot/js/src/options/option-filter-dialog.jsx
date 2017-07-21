import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';
import InputRange from 'react-input-range';
import RCSlider, { Range } from 'rc-slider';
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
            sliderPointsMax: this.props.filterValues.points.max,
            sliderPointsMin: this.props.filterValues.points.min,
            sliderPoints: {min: this.props.filterValues.points.min, max: this.props.filterValues.points.max},
            rangePoints: [this.props.filterValues.points.min, this.props.filterValues.points.max],
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
    
    getSliderMarks: function() {
        var marks = {};
        for(var i = this.props.filterValues.points.min; i <= this.props.filterValues.points.max; i++) {
            marks[i] = i;
        };
        return marks;
    },
    
    handleClear: function() {
        console.log("Clear all filter");
    },
    
    handleRangePointsChange: function(value) {
        this.setState({rangePoints: value});
    },

    handleSliderPointsChange: function(value) {
        this.setState({sliderPoints: value});
    },

    handleSliderPointsMaxChange: function(event, value) {
        this.setState({sliderPointsMax: value});
    },

    handleSliderPointsMinChange: function(event, value) {
        this.setState({sliderPointsMin: value});
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
                    <div className="section">
                        <h4>Min. Points <span>{this.state.sliderPointsMin}</span></h4>
                        <Slider
                            //defaultValue={this.props.filterValues.points.min}
                            min={this.props.filterValues.points.min}
                            max={this.props.filterValues.points.max}
                            name="min_points"
                            onChange={this.handleSliderPointsMinChange}
                            step={1}
                            value={this.state.sliderPointsMin}
                            //onChange={this.handleSecondSlider}
                        />
                        <h4>Max. Points: <span>{this.state.sliderPointsMax}</span></h4>
                        <Slider
                            //defaultValue={this.props.filterValues.points.max}
                            min={this.props.filterValues.points.min}
                            max={this.props.filterValues.points.max}
                            name="max_points"
                            onChange={this.handleSliderPointsMaxChange}
                            step={1}
                            value={this.state.sliderPointsMax}
                            //onChange={this.handleSecondSlider}
                        />
                        <h4>Points</h4>
                        <InputRange 
                            maxValue={this.props.filterValues.points.max}
                            minValue={this.props.filterValues.points.min}
                            value={this.state.sliderPoints}
                            onChange={this.handleSliderPointsChange} 
                        />
                        <h4>Points</h4>
                        <Range 
                            allowCross={true}
                            marks={this.getSliderMarks()}
                            max={this.props.filterValues.points.max}
                            min={this.props.filterValues.points.min}
                            onChange={this.handleRangePointsChange} 
                            trackStyle={[{backgroundColor: indigo500}]}
                            handleStyle={[{borderColor: indigo500}, {borderColor: indigo500}]}
                            activeDotStyle={{borderColor: indigo500}}
                            value={this.state.rangePoints}
                        />
                    </div>
                }
                
                //All filterable field types - numerical, lists, date ranges
                
            </FormsyDialog>
        );
    }
});

module.exports = OptionFilterDialog;