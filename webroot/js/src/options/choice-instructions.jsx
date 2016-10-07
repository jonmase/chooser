import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Loader from '../elements/loader.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var ChoiceInstructions = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Instructions"
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
                            (this.props.containerState.instance.id)?
                                <div>Instance info will be shown here</div>
                            :
                                <div>This Choice is in 'read-only' mode. You can browse the available options, but not make selections.</div>
                        
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = ChoiceInstructions;