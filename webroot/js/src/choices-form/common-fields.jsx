var React = require('react');
var Formsy = require('formsy-react');
var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var FormsyText = require('formsy-material-ui/lib/FormsyText');

var RaisedButton = require('material-ui/lib/raised-button');

var AlloyEditorComponent = require('../elements/alloy.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var styles = {
    textField: {
        marginBottom: '20px',
    }

}

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
        return (
            <div>
                <FormsyText
                    floatingLabelText="Label"
                    hintText="Enter field label"
                    name="label"
                    required
                    style={styles.textField}
                />
                <div style={styles.textField}>
                    <label className="alloy-label">Instructions</label>
                    <div className="alloy-container">
                        <AlloyEditorComponent container="instructions" placeholder="" />
                    </div>
                </div>
                <FormsyToggle
                    label="Required"
                    defaultToggled={false}
                    labelPosition="right"
                    name="required"
                />
                <FormsyToggle
                    label="Show this field to students"
                    defaultToggled={false}
                    labelPosition="right"
                    name="show_to_students"
                />
                <FormsyToggle
                    label="Include in form for student-defined options (where available)"
                    defaultToggled={false}
                    labelPosition="right"
                    name="show_to_students"
                />
                
            </div>
        );
    }
});

module.exports = CommonFields;