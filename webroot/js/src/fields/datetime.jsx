import React from 'react';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsyTime from 'formsy-material-ui/lib/FormsyTime';

var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var DateTimeField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var timeElement = '';
        if(this.props.time) {
            timeElement = <FormsyTime
                    //floatingLabelText={field.label}
                    hintText="Time"
                    //hintText={field.instructions}
                    name={field.name + '_time'}
                    required={required}
                    style={{
                        display: 'inline-block',
                        marginLeft: '20px',
                    }}
                />;
        }
        
        
        return (
            <div className={field.section?'section':''}>
                <label>
                    {field.label}<br />
                    <span className="sublabel">{field.instructions}</span>
                </label>
                <div>
                    <FormsyDate
                        //floatingLabelText="Date"
                        hintText="Date"
                        //hintText={field.instructions}
                        name={field.name + '_date'}
                        required={required}
                        formatDate={function(date) {
                            var dateString = days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                            return dateString;
                        }}
                        style={{display: 'inline-block'}}
                    />
                    {timeElement}
                </div>
            </div>
        );
    }
});

module.exports = DateTimeField;