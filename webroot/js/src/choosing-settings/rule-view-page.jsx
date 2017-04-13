import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';
import Toggle from '../elements/display/toggle-labelled.jsx';

var RuleViewDialog = React.createClass({
    render: function() {
        var rule = this.props.rules[this.props.ruleBeingViewed];
        var title = "Rule: " + rule.name;
        
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                label="Edit"
                onTouchTap={() => this.props.handlers.editButtonClick(this.props.ruleBeingViewed)}
                style={{marginTop: '6px'}}
            />}
            title={title}
        />;
        
        return (
            <Container topbar={topbar}>
                <Text label="Name" value={rule.name} key="name" />
                <Wysiwyg label="Instructions" value={rule.instructions} key="instructions" />
                <Wysiwyg label="Warning" value={rule.warning} key="warning" />
                <Text label="Type" value={rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} key="type" />
                
                {(rule.type === 'points' || rule.type === 'number')?
                    <Text 
                        label="Alowed Values"
                        value={rule.values}
                        key="values" 
                    />
                :""}
                
                <Text 
                    label="Scope"
                    value={rule.scope_text}
                    key="scope" 
                />
                <Toggle
                    label="Hard Rule?" 
                    value={rule.hard} 
                    explanation={"Students can" + (rule.hard?"not submit":" still submit even") + " if they do not fulfil this rule" + (rule.hard?"":", but will be shown a warning")}
                />
            </Container>
        );
    }
});

module.exports = RuleViewDialog;