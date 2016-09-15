import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TopBar from './elements/topbar.jsx';
import NewChoiceForm from './lti-link/choice-new-form.jsx';
import LinkChoiceForm from './lti-link/choice-link-form.jsx';

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={false} />, document.getElementById('topbar'));
ReactDOM.render(<NewChoiceForm />, document.getElementById('new_choice_form'));
if(data.adminChoicesList.length > 0) {
    ReactDOM.render(<LinkChoiceForm data={data.adminChoicesList} />, document.getElementById('link_choice_form'));
}
