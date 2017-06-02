import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Warnings from './selection-warnings.jsx';
import WarningsTitle from './selection-warnings-title.jsx';
import WarningsExplanation from './selection-warnings-explanation.jsx';
import WarningIcon from '../elements/icons/warning.jsx';
import EditableWarning from './selection-editable-warning.jsx';

var SelectionConfirmDialog = React.createClass({
    handleConfirm: function() {
        //Confirm the submit, with fromDialog set to true
        this.props.handlers.submit(null, true);
    },

    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                onTouchTap={this.props.handlers.close}
                secondary={true}
            />,
            <FlatButton
                key="submit"
                label="Submit"
                onTouchTap={this.handleConfirm}
                primary={true}
                type="submit"
            />,
        ];
        
        return (
            <Dialog
                actions={actions}
                autoScrollBodyContent={true}
                modal={true}
                onRequestClose={this.props.handlers.close}
                open={this.props.open}
                title="Confirm Submission"
            >
                {(this.props.selection.ruleWarnings) && 
                    <div>
                        <h5>
                            <span style={{marginRight: '5px'}}><WarningIcon colour={this.props.selection.allowSubmit?"orange":"red"} large={true} /></span>
                            <WarningsTitle 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />
                        </h5>
                        <p>
                            <WarningsExplanation 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />
                        </p>
                        <Warnings
                            allowSubmit={this.props.selection.allowSubmit}
                            rules={this.props.rules}
                            ruleWarnings={this.props.selection.ruleWarnings}
                        />
                    </div>
                }

                <div style={{marginTop: '2em'}}>
                    <EditableWarning
                        instance={this.props.instance.instance}
                    />
                </div>
            </Dialog>
        );
    }
});

module.exports = SelectionConfirmDialog;