import React from 'react';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/icons/topbar-back-button.jsx';

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

        return (
            <Container topbar={topbar} title={null}>
                <OptionTitle 
                    code={this.props.choice.use_code && this.props.option.code}
                    title={this.props.option.title}
                />

                <DefaultFields
                    defaults={this.props.optionDefaultFields}
                    option={this.props.option}
                />
                
                <NumberLabelled 
                    label="Times Selected"
                    value={this.props.option.count}
                />

                {/*selection.options_selections.map(function(optionSelection) {
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
                }, this)*/}
            </Container>
        );
    }
});

module.exports = ResultsIndex;