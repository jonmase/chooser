var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./topbar.jsx');
var NewChoiceForm = require('./new-choice-form.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar />, document.getElementById('topbar'));
ReactDOM.render(<NewChoiceForm />, document.getElementById('new_choice_form'));
