import React from 'react';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/icons/topbar-back-button.jsx';

var ResultsIndex = React.createClass({
    getInitialState: function () {
        var initialState = {
        };
        
        return initialState;
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft={<TopBarBackButton onTouchTap={this.props.resultsContainerHandlers.goToIndex} />}
            iconRight={null}
            sections={this.props.sections} 
            title="Option Selection Details"
            zDepth={2}
        />;

        return (
            <Container topbar={topbar} title={null}>
                {this.props.option.id}
            </Container>
        );
    }
});

module.exports = ResultsIndex;