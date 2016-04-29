var React = require('react');
var Formsy = require('formsy-react');
var FormsySelect = require('formsy-material-ui/lib/FormsySelect');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');

var RaisedButton = require('material-ui/lib/raised-button');
var MenuItem = require('material-ui/lib/menus/menu-item');

var FilteringToggle = require('./filtering-toggle.jsx');
var Textarea = require('../fields/textarea.jsx');

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
    
        return (
            <div style={{display: (this.props.type === 'list')?'block':'none'}}>
                <div>
                    <FilteringToggle default={true} />
                    <FormsyToggle
                        label="Use as category (for creating rules)"
                        defaultToggled={false}
                        labelPosition="right"
                        name="rule_category"
                    />
                </div>
                <div className="section">
                    <FormsySelect
                        name="type"
                        required
                        floatingLabelText="List type"
                        onChange={this.typeSelectChange}
                    >
                        {typeMenuItems}
                    </FormsySelect>                        
                </div>
                <Textarea
                    name="options"
                    label="Options"
                    sublabel="Enter one option per line, in the order you want them to appear"
                    rows={3}
                    section={true}
                />
            </div>
        );
    }
});

module.exports = CommonFields;