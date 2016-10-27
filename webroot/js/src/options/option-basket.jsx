import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Loader from '../elements/loader.jsx';
import Text from '../elements/display/text.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import DateTime from '../elements/display/datetime.jsx';

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
                    {(this.props.containerState.optionsSelected.length > 0)?
                        this.props.containerState.optionsSelected.map(function(optionId) {
                            var option = this.props.containerState.options[this.props.containerState.optionIndexesById[optionId]];
                            
                            return (
                                <div key={option.id}>
                                    {this.props.choice.use_code?
                                        <Text 
                                            value={option.code + (this.props.choice.use_title?" - ":"")}
                                        />
                                    :""}
                                    {this.props.choice.use_title?
                                        <Text 
                                            value={option.title}
                                        />
                                    :""}
                                </div>
                            );
                        }, this)
                    :
                        <div>No options chosen</div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = OptionBasket;