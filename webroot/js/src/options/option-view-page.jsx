import React from 'react';

import Formsy from 'formsy-react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import DefaultFields from './default-fields.jsx';
import ExtraFieldLabelled from './extra-field-labelled.jsx';
import OptionTitle from './option-title.jsx';
import RejectDialog from './option-reject-dialog.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';
import Alert from '../elements/alert.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';

var OptionViewPage = React.createClass({
    getInitialState: function () {
        var initialState = {
            rejectDialogOpen: false,
        };
        
        return initialState;
    },
    
    handleApproveButtonClick: function() {
        var optionId = this.props.option.id;
        console.log('approve option: ' + optionId);
        this.props.optionContainerHandlers.changeStatus('approve', optionId, true);
    },
    
    handleReject: function(data) {
        var optionId = this.props.option.id;
        console.log('reject option: ' + optionId);
        this.props.optionContainerHandlers.changeStatus('approve', optionId, false, data.comments);
    },
    
    handleRejectButtonClick: function() {
        this.setState({
            rejectDialogOpen: true,
        });
    },
    
    handleRejectDialogClose: function() {
        this.setState({
            rejectDialogOpen: false,
        });
    },
    
    render: function() {
        var title = 'Option Details';
        if(this.props.action === 'approve') {
            title = 'Approve or Reject Option';
        }

        var option = this.props.option;
        var alert = null;

        var backAction = this.props.optionContainerHandlers.backToView;
        if(this.props.action === 'more_edit' || this.props.action === 'approve') {
            var backAction = this.props.optionContainerHandlers.backToEdit;
        }
            
        if(this.props.action === 'more_view' && this.props.selectionEnabled) {
            var topbarIconRight=<Checkbox 
                disableTouchRipple={true}
                iconStyle={{color: 'white', fill: 'white', height: '48px', width: '48px'}}
                label={false} 
                onCheck={this.props.optionContainerHandlers.selectOption}
                checked={this.props.optionsSelectedTableOrder.indexOf(this.props.option.id) > -1}
            />;
        }
        else if(this.props.action === 'more_edit') {
            var topbarIconRight = <EditButton
                handleClick={this.props.optionContainerHandlers.edit} 
                iconStyle={{color: 'white'}}
                id={this.props.option.id}
                tooltip=""
            />;
        }
        else if(this.props.action === 'approve') {
            var topbarIconRight = <span>
                <RaisedButton 
                    disabled={option.approved === false}
                    label={"Reject" + (option.approved === false?"ed":"")}
                    onTouchTap={this.handleRejectButtonClick}
                    //primary={true}
                    style={{marginTop: '6px', marginRight: '12px'}}
                    type="submit"
                />
                <RaisedButton 
                    disabled={option.approved === true}
                    label={"Approve" + (option.approved === true?"d":"")}
                    onTouchTap={this.handleApproveButtonClick}
                    //primary={true}
                    style={{marginTop: '6px'}}
                    type="submit"
                />
            </span>;
            
            switch(option.approved) {
                case true:
                    alert = <Alert>
                        This option has already been approved, but you can change this decision and reject it.
                    </Alert>;
                    break;
                case false:
                    alert = <Alert>
                        This option has already been rejected, but you can change this decision and approve it.
                    </Alert>;
                    break;
                default:
                    if(option.approver_comments !== null) {
                        if(option.approver_comments) {
                            var approverComments = " the following comments: " + option.approver_comments;
                        }
                        else {
                            var approverComments = "out any comments";
                        }
                        alert = <Alert>
                            This option has previously been rejected, with{approverComments}.
                        </Alert>;
                    }
                    else {
                        if(option.approver !== null) {
                            alert = <Alert>
                                This option has previously been approved.
                            </Alert>;
                        }
                    }
                    break;
            }
        }
            
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={backAction} />}
            iconRight={topbarIconRight}
            title={title}
        />;

        return (
            <Container topbar={topbar} title={null}>
                {alert}
                
                <OptionTitle 
                    code={this.props.choice.use_code && option.code}
                    title={option.title}
                />
                
                <DefaultFields
                    choice={this.props.choice}
                    option={option}
                />
                
                {this.props.choice.extra_fields.map(function(field) {
                    var value = null;
                    if(option && typeof(option[field.name]) !== "undefined") {
                        value = option[field.name];
                    }
                
                    return (
                        <ExtraFieldLabelled
                            explanation={field.explanation}
                            extra={field.extra}
                            //field={field}
                            key={field.id}
                            label={field.label}
                            options={field.options}
                            paragraph={true}
                            type={field.type}
                            value={value}
                        />
                    );
                }, this)}
                <RejectDialog 
                    handlers={{
                        close: this.handleRejectDialogClose,
                        submit: this.handleReject,
                    }}
                    open={this.state.rejectDialogOpen}
                    option={option}
                />
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = OptionViewPage;