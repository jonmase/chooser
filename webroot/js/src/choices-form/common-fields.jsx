var React = require('react');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');

var Wysiwyg = require('../fields/wysiwyg.jsx');
var Textarea = require('../fields/textarea.jsx');
var TextField = require('../fields/text.jsx');

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
        return (
            <div style={{display: this.props.type?'block':'none'}}>
                <div className="section">
                    <TextField
                        label="Label"
                        hint="Enter field label"
                        name="label"
                    />
                </div>
                {/*<div className="section">
                    <label className="alloy-label">Instructions</label>
                    <div className="alloy-container">
                        <Wysiwyg container="instructions" placeholder="" />
                    </div>
                </div>*/}
                <Textarea
                    name="instructions"
                    label="Instructions"
                    sublabel="Enter instructions for completing this field"
                    rows={2}
                    section={true}
                />
                <FormsyToggle
                    label="Required"
                    defaultToggled={false}
                    labelPosition="right"
                    name="required"
                />
                <FormsyToggle
                    label="Show this field to students"
                    defaultToggled={true}
                    labelPosition="right"
                    name="show_to_students"
                />
                <FormsyToggle
                    label="Include in form for student-defined options (where available)"
                    defaultToggled={true}
                    labelPosition="right"
                    name="in_user_defined_form"
                />
                <FormsyToggle
                    label="Allow sorting by this field"
                    defaultToggled={true}
                    labelPosition="right"
                    name="sortable"
                />
            </div>
        );
    }
});

module.exports = CommonFields;