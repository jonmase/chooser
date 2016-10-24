import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Loader from '../elements/loader.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import DateTime from '../elements/display/datetime-labelled.jsx';
import Rules from './choice-instructions-rules.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var ChoiceInstructions = React.createClass({
    render: function() {
        var instance = this.props.containerState.instance;
        var rules = this.props.containerState.rules;
        
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Instructions & Rules"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                    style={styles.cardText}
                >
                    {(!this.props.containerState.instanceLoaded)?
                            <Loader />
                        :
                            (instance.id)?
                                <div className="row">
                                    <div className="col-md-6">
                                        <Wysiwyg value={instance.choosing_instructions} />
                                        {(instance.opens)?
                                            <DateTime label="Opens" value={instance.opens} />
                                        :""}
                                        {(instance.deadline)?
                                            <DateTime label="Deadline" value={instance.deadline} />
                                        :""}
                                        {(instance.extension)?
                                            <DateTime label="Extension" value={instance.extension} />
                                        :""}
                                    </div>
                                    <div className="col-md-6">
                                        <Rules rules={this.props.containerState.rules} />
                                    </div>
                                </div>
                            :
                                <div>This Choice is in 'read-only' mode. You can browse the available options, but not make selections.</div>
                        
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = ChoiceInstructions;