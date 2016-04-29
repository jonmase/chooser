var React = require('react');
var FormsyText = require('formsy-material-ui/lib/FormsyText');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var TextField = React.createClass({
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
        var required=this.props.required?true:false;
        return (
            <FormsyText
                floatingLabelText={this.props.label}
                hintText={this.props.hint}
                name={this.props.name}
                required={required}
            />
        );
    }
});

module.exports = TextField;