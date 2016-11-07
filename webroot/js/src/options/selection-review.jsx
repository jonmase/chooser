import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import OptionList from './option-list.jsx';

import Loader from '../elements/loader.jsx';

import Text from '../elements/display/text-labelled.jsx';
import DateTime from '../elements/display/datetime.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var SelectionReview = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                //initiallyExpanded={true}
            >
                <CardHeader
                    title="Review Chosen Options"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                <CardText 
                    //expandable={true}
                    style={styles.cardText}
                >
                    {(!this.props.options.loaded || !this.props.instance.loaded || !this.props.rulesLoaded)?
                        <Loader />
                    :
                        <div>
                            {(this.props.selection.optionsSelected.length > 0)?
                                <div style={{width: '100%'}}>
                                    <OptionList
                                        action="review"
                                        instance={this.props.instance.instance}
                                        optionIds={this.props.selection.optionsSelected}
                                        options={this.props.options}
                                        removeButton={false}
                                        useCode={this.props.choice.use_code}
                                    />
                                </div>
                            :
                                <div>No options chosen</div>
                            }
                            
                            {(this.props.instance.instance.comments_overall && this.props.selection.comments)?
                                <Text 
                                    content={this.props.selection.comments}
                                    label="Comments"
                                />
                            :""}
                            
                            {(this.props.instance.instance.editable)?
                                <div style={{marginTop: '15px'}}>
                                    <p>You can change your choices until the deadline: <DateTime value={this.props.instance.instance.deadline} /></p>
                                    <RaisedButton
                                        label="Change"
                                        onTouchTap={this.props.optionContainerHandlers.backToEdit}
                                        primary={false}
                                    />
                                </div>
                            :""}
                        </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = SelectionReview;