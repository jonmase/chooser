var React = require('react');
var Formsy = require('formsy-react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');

var RaisedButton = require('material-ui/lib/raised-button');
var MenuItem = require('material-ui/lib/menus/menu-item');

var FilteringToggle = require('./filtering-toggle.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var CommonFields = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
    render: function() {
        var listTypes = [
            {
                type: 'radio',
                label: 'Radio buttons (select one)',
            },
            {
                type: 'checkbox',
                label: 'Checkboxes (select multiple)',
            },
            {
                type: 'dropdown',
                label: 'Dropdown list (select one)',
            },
            {
                type: 'multidropdown',
                label: 'Dropdown list (select multiple)',
            },
        ];

        var typeMenuItems = listTypes.map(function(type) {
            return (
                <MenuItem value={type.type} key={type.type} primaryText={type.label} />
            );
        });
        
        var numericError = "Please enter a number";
    
        return (
            <div style={{display: (this.props.type === 'number')?'block':'none'}}>
                <div>
                    <FilteringToggle default={false} />
                </div>
                <div>
                    <FormsyText
                        floatingLabelText="Minimum value"
                        hintText="Enter minimum"
                        name="number_minimum"
                        validations="isNumeric"
                        validationError={numericError}
                    />
                </div>
                <div className="section">
                    <FormsyText
                        floatingLabelText="Maximum value"
                        hintText="Enter maximum"
                        name="number_maximum"
                        validations="isNumeric"
                        validationError={numericError}
                    />
                </div>
            </div>
        );
    }
});

module.exports = CommonFields;