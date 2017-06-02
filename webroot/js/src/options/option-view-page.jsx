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

        var backAction = this.props.optionContainerHandlers.backToView;
        if(this.props.action === 'more_edit' || this.props.action === 'approve') {
            var backAction = this.props.optionContainerHandlers.backToEdit;
        }
            
        if(this.props.action === 'more_view') {
            var topbarIconRight=<Checkbox 
                disableTouchRipple={true}
                iconStyle={{color: 'white', fill: 'white', height: '48px', width: '48px'}}
                label={false} 
                onCheck={this.handleOptionSelectFromDetails}
                //checked={typeof(this.state.optionsSelected[this.state.optionBeingViewed]) !== "undefined"}
                checked={this.state.optionsSelectedTableOrder.indexOf(this.state.optionBeingViewed) > -1}
            />;
        }
        else if(this.props.action === 'more_edit') {
            var topbarIconRight = <EditButton
                handleClick={this.handleOptionEditButtonClick} 
                iconStyle={{color: 'white'}}
                id={this.state.optionBeingViewed}
                tooltip=""
            />;
        }
        else if(this.props.action === 'approve') {
            var topbarIconRight = <span>
                <RaisedButton 
                    label="Reject"
                    onTouchTap={this.handleRejectButtonClick}
                    //primary={true}
                    style={{marginTop: '6px', marginRight: '12px'}}
                    type="submit"
                />
                <RaisedButton 
                    label="Approve"
                    onTouchTap={this.handleApproveButtonClick}
                    //primary={true}
                    style={{marginTop: '6px'}}
                    type="submit"
                />
            </span>;
        }
            
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={backAction} />}
            iconRight={topbarIconRight}
            title={title}
        />;

        var defaults = {
            code: false,    //Don't use code or title, as these are shown in the option title
            title: false,
            description: this.props.choice.use_description,
            min_places: this.props.choice.use_min_places,
            max_places: this.props.choice.use_max_places,
            points: this.props.choice.use_points,
        };
        
        var option = this.props.option;

        return (
            <Container topbar={topbar} title={null}>
                <Alert>
                    Alert message
                </Alert>
                <OptionTitle 
                    code={this.props.choice.use_code && option.code}
                    title={option.title}
                />
                
                <DefaultFields
                    defaults={defaults}
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