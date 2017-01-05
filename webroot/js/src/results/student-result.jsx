import React from 'react';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/icons/topbar-back-button.jsx';

import Text from '../elements/display/text.jsx';
import TextLabelled from '../elements/display/text-labelled.jsx';
import NumberLabelled from '../elements/display/number-labelled.jsx';
import DateTimeLabelled from '../elements/display/datetime-labelled.jsx';

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
            title="Student Result Details"
            zDepth={2}
        />;
        
        var selection = this.props.selection;

        return (
            <Container topbar={topbar} title={null}>
                <h3>{selection.user.fullname} ({selection.user.username})</h3>
                <TextLabelled 
                    label="Status"
                    value={selection.confirmed?"Submitted":"Auto-saved"}
                />
                <DateTimeLabelled 
                    label={selection.confirmed?"Date/Time Submitted":"Date/Time Saved"}
                    time={true}
                    value={selection.modified}
                />
                <TextLabelled 
                    label="Comments"
                    value={selection.comments}
                />
                <NumberLabelled 
                    label="Options Selected"
                    value={selection.option_count}
                />

                {selection.options_selections.map(function(optionSelection) {
                    var option = this.props.options[this.props.optionIndexesById[optionSelection.choices_option_id]];
                    
                    return (
                        <div>
                            <Text 
                                value={
                                    ((this.props.choice.use_code)?(option.code + ": "):"")
                                    + option.title
                                }
                            />
                        </div>
                    );
                }, this)}
            </Container>
        );
    }
});

module.exports = ResultsIndex;