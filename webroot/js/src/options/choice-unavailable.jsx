import React from 'react';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';

var ChoiceUnavailable = React.createClass({
    render: function() {
        var topbar = <TopBar 
            iconLeft={null} //Left icon is shown by deafult, so set to null to hide it
            title={this.props.title}
        />;
        
        return (
            <Container topbar={topbar} title="Choice Unavailable">
                <p>
                    This Choice is currently unavailable. Please contact the staff responsible if you were expecting it to be available to you. 
                </p>
            </Container>
        );
    }
});

module.exports = ChoiceUnavailable;