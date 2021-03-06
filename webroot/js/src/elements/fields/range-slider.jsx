import React from 'react';

import Slider, { Range } from 'rc-slider';
import {indigo500} from 'material-ui/styles/colors';

var RangeSlider = React.createClass({
    getInitialState: function () {
        var initialState = {
        };
        
        return initialState;
    },

    getSliderMarks: function() {
        var min = this.props.min;
        var max = this.props.max;
        var diff = max - min;
        var step = 1;
        
        //Work out what the gap between marks should be
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
        
        //Set the max and min marks as the max and min values
        var minMark = min;
        var maxMark = max;
        
        //The remaining marks, which will be created by a for loop, should be on multiples of the step
        //If step is 1, the first and last in the loop should just be one in from the ends
        var minStepMark = min + 1;
        var maxStepMark = max - 1;
        //For larger steps, the first and last should be first multiple of step in from the ends
        if(step > 1) {
            //If min is a multiple of step, the first iterated mark will just be one step in from min
            if(min%step === 0) {
                minStepMark = min + step;
            }
            //Otherwise, round up min/step and multiply bt step to get the first multiple
            else {
                minStepMark = Math.ceil(min/step) * step;
            }
            
            //If max is a multiple of step, the last iterated mark will just be one step in from max
            if(max%step === 0) {
                maxStepMark = max - step;
            }
            //Otherwise, round down max/step and multiply bt step to get the last multiple
            else {
                maxStepMark = Math.floor(max/step) * step;
            }
        }
        
        //First mark is the min and last is the max
        var marks = {
            [minMark]: minMark,
            [maxMark]: maxMark,
        };
        for(var i = minStepMark; i <= maxStepMark; i+= step) {
            marks[i] = i;
        };
        return marks;
    },
    
    handleSliderChange: function(value) {
        this.props.onChange(this.props.name, value);
    },

    render: function() {
        return (
            <div className={this.props.section?"section":""} style={{paddingRight: this.props.rightPaddingAdjustment, paddingBottom: '20px'}}>
                <label className="option-field-label">{this.props.label}: <span>{this.props.value[0]} to {this.props.value[1]}</span></label>
                <Range 
                    activeDotStyle={{borderColor: indigo500}}
                    allowCross={true}
                    handleStyle={[{borderColor: indigo500}, {borderColor: indigo500}]}
                    marks={this.getSliderMarks(this.props.name)}
                    max={this.props.max}
                    min={this.props.min}
                    name={this.props.name}
                    onChange={(value) => { this.handleSliderChange(value)}} 
                    style={{marginTop: '5px'}}
                    trackStyle={[{backgroundColor: indigo500}]}
                    value={this.props.value}
                />
            </div>
        );
    }
});

module.exports = RangeSlider;