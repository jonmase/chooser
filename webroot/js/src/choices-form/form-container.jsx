var React = require('react');
var Snackbar = require('material-ui/lib/snackbar');
var DefaultFields = require('./default-fields.jsx');
var ExtraFields = require('./extra-fields.jsx');

var FormContainer = React.createClass({
    getInitialState: function () {
        return {
            extraDialogOpen: false,
            defaults: {
                code: this.props.choice.use_code,
                title: this.props.choice.use_title,
                description: this.props.choice.use_description,
                min_places: this.props.choice.use_min_places,
                max_places: this.props.choice.use_max_places,
                points: this.props.choice.use_points,
            },
            defaultsButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    
    //Handle a change to the default field settings - enable the save button
    handleDefaultsChange: function() {
        this.setState({
            defaultsButton: {
                disabled: false,
                label: 'Save',
            },
        });
    },
    
    //Submit the defaults form
    handleDefaultsSubmit: function (defaults) {
        this.setState({
            defaultsButton: {
                disabled: true,
                label: 'Saving',
            },
        });

        console.log("Saving default field settings for Choice " + this.props.choice.id + ": ", defaults);
        
        //Save the settings
        var url = '../form_defaults/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: defaults,
            success: function(returnedData) {
                console.log(returnedData.response);
                //Update the state with the updated data, and set 
                //var stateData = settings;
                var stateData = {};
                stateData.defaultsButton = {
                    disabled: true,
                    label: 'Saved',
                };
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    defaultsButton: {
                        disabled: false,
                        label: 'Resave',
                    },
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleExtraDialogOpen: function() {
        this.setState({
            extraDialogOpen: true,
        });
    },

    handleExtraDialogClose: function() {
        this.setState({
            extraDialogOpen: false,
        });
    },

    //Submit the defaults form
    handleExtraSubmit: function (field) {
        console.log("Saving extra field for Choice " + this.props.choice.id + ": ", field);
        
        //Save the settings
        var url = '../form_extra/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: defaults,
            success: function(returnedData) {
                console.log(returnedData.response);
                //Update the state with the updated data, and set 
                //var stateData = settings;
                var stateData = {};
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    render: function() {
        var defaultsHandlers={
            change: this.handleDefaultsChange,
            submit: this.handleDefaultsSubmit,
        };

        var extrasHandlers={
            dialogOpen: this.handleExtraDialogOpen,
            dialogClose: this.handleExtraDialogClose,
            submit: this.handleExtraSubmit,
        };
        
        return (
            <div>
                <p>This is where you can define the fields that you want to appear on the form for creating/editing options. </p>
                <DefaultFields 
                    choice={this.props.choice}
                    state={this.state}
                    handlers={defaultsHandlers}
                />
                <ExtraFields 
                    choice={this.props.choice}
                    state={this.state}
                    handlers={extrasHandlers}
                />
                <Snackbar
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarClose}
                />
            </div>
        );
    }
});

module.exports = FormContainer;