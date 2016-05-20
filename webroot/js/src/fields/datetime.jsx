import React from 'react';

import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsyTime from 'formsy-material-ui/lib/FormsyTime';

import FieldLabel from '../elements/label.jsx';

var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var xs = 12;
var sm = 6;
var md = 4;
var lg = 3;
var colClasses = 'col-xs-' + xs + ' col-sm-' + sm + ' col-md-' + md + ' col-lg-' + lg
        
var DateTimeField = React.createClass({
    handleChangeTimePicker: function(event, time) {
        console.log(time);
    },
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var timeElement = '';
        if(this.props.time) {
            timeElement = 
                <div className={colClasses}>
                    <FormsyTime
                        //autoOk={true}
                        //defaultTime='11:23'   //Should be object, but not sure the format
                        format='24hr'
                        hintText="Time"
                        name={field.name + '_time'}
                        onChange={this.handleChangeTimePicker}
                        //pedantic={true}
                        required={required}
                    />
                </div>;
        }
        
        
        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                <div className="row">
                    <div className={colClasses}>
                        <FormsyDate
                            autoOk={true}
                            hintText="Date"
                            name={field.name + '_date'}
                            required={required}
                            formatDate={function(date) {
                                var dateString = days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                                return dateString;
                            }}
                        />
                    </div>
                    {timeElement}
                </div>
            </div>
        );
    }
});

module.exports = DateTimeField;