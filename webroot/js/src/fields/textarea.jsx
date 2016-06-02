import React from 'react';

import Formsy from 'formsy-react';

var FormsyTextarea = React.createClass({
    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],
    render: function() {
        return (
            <textarea id={this.props.name} name={this.props.name} defaultValue={this.props.value} />
        );
    }
});

module.exports = FormsyTextarea;