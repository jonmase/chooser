import React from 'react';

import {List, ListItem} from 'material-ui/List';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import NumberLabelled from '../elements/display/number-labelled.jsx';
import OptionTitle from '../options/option-title.jsx';
import DefaultFields from '../options/default-fields.jsx';


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
            title="Option Result Details"
            zDepth={2}
        />;

        var option = this.props.option;
        
        return (
            <Container topbar={topbar} title={null}>
                <OptionTitle 
                    code={this.props.choice.use_code && option.code}
                    title={option.title}
                />

                <DefaultFields
                    defaults={this.props.optionDefaultFields}
                    option={option}
                />
                
                <NumberLabelled 
                    label="Times Chosen"
                    value={option.count}
                />

                <div>
                    <strong>Chosen by:</strong><br />
                    <List>
                        {option.selected_by.map(function(selectionId) {
                            var selection = this.props.selections[this.props.selectionIndexesById[selectionId]];
                            
                            return (
                                <ListItem
                                    disabled={true}
                                    primaryText={selection.user.fullname + " (" + selection.user.username + ")"}
                                    secondaryText={null}
                                    secondaryTextLines={1}
                                />

                            );
                        }, this)}
                    </List>
                </div>
            </Container>
        );
    }
});

module.exports = ResultsIndex;