import React from 'react';

import Url from './url.jsx';

var UrlLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.field.label}: </strong>
                <Url field={this.props.field} />
            </p>
        );
    }
});

module.exports = UrlLabelled;