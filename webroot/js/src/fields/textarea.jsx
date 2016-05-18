import React from 'react';

var TextareaField = React.createClass({
    render: function() {
        var field = this.props.field;

        return (
            <div className={field.section?'section':''}>
                <label>
                    {field.label}<br />
                    <span className="sublabel">{field.instructions}</span>
                </label>
                <div>
                    <textarea rows={field.rows} name={field.name} style={{width: '100%'}} />
                </div>
            </div>
        );
    }
});

module.exports = TextareaField;