import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from '../fields/text.jsx';
import MultilineTextField from '../fields/multiline-text.jsx';
import EmailField from '../fields/email.jsx';
import UrlField from '../fields/url.jsx';
import Wysiwyg from '../fields/wysiwyg.jsx';
import FileField from '../fields/file.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var ProfileContainer = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            editButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    
    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    //Handle a change to the default field settings - enable the save button
    handleChange: function(currentValues, isChanged, arg3, arg4) {
        console.log('Changed?', isChanged, '; Values: ', currentValues);
        this.setState({
            editButton: {
                disabled: false,
                label: 'Save',
            },
        });
    },
    
    //Submit the profile form
    handleSubmit: function (profile) {
        this.setState({
            editButton: {
                disabled: true,
                label: 'Saving',
            },
        });

        console.log("Saving profile: ", profile);
        
        //Save the settings
        var url = '../save';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: defaults,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                stateData.editButton = {
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
                    editButton: {
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
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    render: function() {
        var profile = data.profile;
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <p>Create and edit your profile using the form below. The information you provide here will be shown to students with the options that you offer. Your profile will be the same for all Choices where you offer options, so only enter information you are happy to be seen by students for all of those Choices.</p>
                    <Formsy.Form
                        id="profile_form"
                        method="POST"
                        onChange={this.handleChange}
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.handleSubmit}
                        noValidate
                    >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <TextField
                                    field={{
                                        label: "Title",
                                        instructions: "Dr, Prof, etc",
                                        name: "title",
                                        section: false,
                                        required: false,
                                        value: profile.title,
                                    }}
                                />
                                <TextField
                                    field={{
                                        label: "First Name(s)",
                                        instructions: "",
                                        name: "firstname",
                                        section: false,
                                        required: false,
                                        value: profile.firstname,
                                    }}
                                />
                                <TextField
                                    field={{
                                        label: "Last Name(s)",
                                        instructions: "",
                                        name: "lastname",
                                        section: false,
                                        required: false,
                                        value: profile.lastname,
                                    }}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <EmailField
                                    field={{
                                        label: "Email",
                                        instructions: "",
                                        name: "email",
                                        section: false,
                                        required: false,
                                        value: profile.email,
                                    }}
                                />
                                <TextField
                                    field={{
                                        label: "Phone Number",
                                        instructions: "",
                                        name: "phone",
                                        section: false,
                                        required: false,
                                        value: profile.phone,
                                    }}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <TextField
                                    field={{
                                        label: "Department",
                                        instructions: "",
                                        name: "department",
                                        section: false,
                                        required: false,
                                        value: profile.department,
                                    }}
                                />
                                <TextField
                                    field={{
                                        label: "College",
                                        instructions: "",
                                        name: "college",
                                        section: false,
                                        required: false,
                                        value: profile.college,
                                    }}
                                />
                                <MultilineTextField
                                    field={{
                                        label: "Address/Location",
                                        //instructions: "Enter your office/lab address, if you want students to know where to find you.",
                                        name: "address",
                                        section: false,
                                        value: profile.address,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row section">
                            <div className="col-xs-12 col-sm-6">
                                <UrlField
                                    field={{
                                        label: "Personal Website URL",
                                        instructions: "",
                                        name: "personal_url",
                                        section: true,
                                        required: false,
                                        value: profile.personal_url,
                                    }}
                                />
                                <Wysiwyg
                                    field={{
                                        label: "Biography",
                                        //instructions: "Enter the description of this option. Select text to format it or create links. Use the + icon to add images, links or tables.",
                                        name: "biography",
                                        onChange: this.handleChange,
                                        section: false,
                                        value: profile.biography,
                                    }}
                                />
                                {/*<FileField
                                    field={{
                                        label: "Image",
                                        instructions: "",
                                        name: "image",
                                        section: false,
                                        required: false,
                                    }}
                                />*/}
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <UrlField
                                    field={{
                                        label: "Lab/Professional Website URL",
                                        instructions: "",
                                        name: "lab_url",
                                        section: true,
                                        required: false,
                                        value: profile.lab_url,
                                    }}
                                />
                                <Wysiwyg
                                    field={{
                                        label: "Lab/Professional Info",
                                        //instructions: "Enter the description of this option. Select text to format it or create links. Use the + icon to add images, links or tables.",
                                        name: "lab",
                                        section: false,
                                        value: profile.lab,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="section">
                            <RaisedButton 
                                label={this.state.editButton.label} 
                                primary={true} 
                                type="submit"
                                disabled={this.state.editButton.disabled}
                            />
                        </div>
                    </Formsy.Form>
                    <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleSnackbarClose}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});

module.exports = ProfileContainer;