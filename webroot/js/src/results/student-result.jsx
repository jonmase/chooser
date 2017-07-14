import React from 'react';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import Text from '../elements/display/text.jsx';
import TextLabelled from '../elements/display/text-labelled.jsx';
import DateTimeLabelled from '../elements/display/datetime-labelled.jsx';
import OptionList from '../options/option-list.jsx';

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
                <TextLabelled 
                    label="Options Selected"
                    value={selection.option_count}
                />

                <div style={{width: '100%'}}>
                    {(selection.options_selected_ids_ordered.length > 0)&&
                        <OptionList
                            optionIndexesById={this.props.optionIndexesById}
                            options={this.props.options}
                            optionsSelectedById={selection.options_selected_by_id}
                            optionsSelectedIdsOrdered={selection.options_selected_ids_ordered}
                            preferenceType={this.props.instance.preference_type}
                            showCommentsTextPerOption={this.props.instance.comments_per_option}
                            showPreferenceValues={this.props.instance.preference}
                            //style={{paddingTop: 0}}
                            useCode={this.props.choice.use_code}
                        />
                    }
                </div>
            </Container>
        );
    }
});

module.exports = ResultsIndex;