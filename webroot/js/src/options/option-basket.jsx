import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';
import RaisedButton from 'material-ui/RaisedButton';

import OptionList from './option-list.jsx';
import OptionWarnings from './option-warnings.jsx';

import Loader from '../elements/loader.jsx';
import Text from '../elements/display/text.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import DateTime from '../elements/display/datetime.jsx';
import TextLabelled from '../elements/display/text-labelled.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var OptionBasket = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Chosen Options"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                    style={styles.cardText}
                >
                    {(!this.props.containerState.optionsLoaded || !this.props.containerState.instanceLoaded || !this.props.containerState.rulesLoaded)?
                        <Loader />
                    :
                        <div>
                            {(this.props.containerState.optionsSelected.length > 0)?
                                <OptionList
                                    containerState={this.props.containerState}
                                    removeButton={true}
                                    removeHandler={this.props.optionContainerHandlers.removeOption}
                                    useCode={this.props.choice.use_code}
                                />
                            :
                                <div>No options chosen</div>
                            }
                            {(this.props.containerState.ruleWarnings)?
                                <OptionWarnings
                                    containerState={this.props.containerState}
                                />
                            :""}
                            <div style={{marginTop: '15px'}}>
                                <RaisedButton
                                    disabled={!this.props.containerState.allowSubmit}
                                    label="Submit"
                                    onTouchTap={this.props.optionContainerHandlers.submit}
                                    primary={true}
                                />
                            </div>
                        </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = OptionBasket;