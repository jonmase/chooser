import React from 'react';

import Dialog from 'material-ui/Dialog';

import Formsy from 'formsy-react';

var FormsyDialog = React.createClass({
    render: function() {
        var autoScrollBodyContent = (typeof(this.props.dialogAutoScrollBodyContent) === 'undefined')?true:this.props.dialogAutoScrollBodyContent;
        var modal = (typeof(this.props.dialogModal) === 'undefined')?true:this.props.dialogModal;
        var noValidate = (typeof(this.props.formNoValidate) === 'undefined')?true:this.props.formNoValidate;
        var method = (typeof(this.props.formMethod) === 'undefined')?'POST':this.props.formMethod;

        return (
            <Dialog
                autoScrollBodyContent={autoScrollBodyContent}
                bodyStyle={{padding: '0px'}}
                contentStyle={this.props.contentStyle}
                modal={modal}
                onRequestClose={this.props.dialogOnRequestClose}
                open={this.props.dialogOpen}
                title={this.props.dialogTitle}
            >
                <Formsy.Form
                    id={this.props.formId}
                    method={method}
                    onValid={this.props.formOnValid}
                    onInvalid={this.props.formOnInvalid}
                    onValidSubmit={this.props.formOnValidSubmit}
                    noValidate={noValidate}
                >
                    <div style={{padding: '0px 24px 24px'}}>
                        {this.props.children}
                    </div>
                    {/*Add actions here, as using the Dialog actions attribute doesn't work with the form */}
                    <div style={{textAlign: 'right', padding: '8px', borderTop: '1px solid rgb(224,224,224)'}}>
                        {this.props.actions}
                    </div>
                </Formsy.Form>
            </Dialog>
        );
    }
});

module.exports = FormsyDialog;