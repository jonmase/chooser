var React = require('react');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var FilteringToggle = React.createClass({
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
            <FormsyToggle
                label="Allow filtering by this field"
                defaultToggled={this.props.default}
                labelPosition="right"
                name="filterable"
            />
        );
    }
});

module.exports = FilteringToggle;