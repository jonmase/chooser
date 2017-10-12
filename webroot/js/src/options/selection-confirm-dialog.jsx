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

    handleReload: function() {
        window.location.reload();
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
                key="reload"
                label="Reload"
                onTouchTap={this.handleReload}
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
                {(this.props.submissionsSinceTimestamp) &&
                    <div>
                        <h5><span style={{marginRight: '5px'}}><WarningIcon colour="red" large={true} /></span>It looks like have submitted another selection for this choice (possibly in another tab, window or browser) since opening this page. Submitting this selection will overwrite any previous selections you have made. </h5>
                        <ul>
                            <li>Choose <b>Submit</b> if you are happy to overwrite your previous selections.</li>
                            <li>Choose <b>Reload</b> to reload the page and view your most recent selection. You will lose the choices you have made on this page.</li>
                            <li>Otherwise, choose <b>Cancel</b>.</li>
                        </ul>
                        
                    </div>
                }
            
                {(this.props.selection.ruleWarnings) && 
                    <div>
                        <h5>
                            <span style={{marginRight: '5px'}}><WarningIcon colour={this.props.selection.allowSubmit?"orange":"red"} large={true} /></span>
                            <WarningsTitle />
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
                        choosingInstance={this.props.instance.choosing}
                    />
                </div>
            </Dialog>
        );
    }
});

module.exports = SelectionConfirmDialog;