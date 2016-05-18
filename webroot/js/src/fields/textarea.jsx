import React from 'react';

import FieldLabel from '../elements/label.jsx';

var TextareaField = React.createClass({
    render: function() {
        var field = this.props.field;

        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                <div>
                    <textarea rows={field.rows} name={field.name} style={{width: '100%'}} />
                </div>
            </div>
        );
    }
});

module.exports = TextareaField;