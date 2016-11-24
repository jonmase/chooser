import React from 'react';

import NewChoiceForm from './choice-new-form.jsx';
import LinkChoiceForm from './choice-link-form.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../elements/theme.jsx';

var SectionsCards = React.createClass({
    render: function() {
        var topbar = <TopBar 
            iconLeft={null}
            iconRight={null}
            title={<AppTitle subtitle={null} />}
        />;

        var showList = this.props.choices.length > 0;
        
        return (
            <Container topbar={topbar}>
                <h2 className="page-title">Choice Setup</h2>
                <div className="row">
                    {(showList) &&
                        <div className="col-xs-12 col-md-6">
                            <LinkChoiceForm choices={this.props.choices} />
                        </div>
                    }
                    <div className={'col-xs-12' + (showList?' col-md-6':'')}>
                        <NewChoiceForm />
                    </div>
                </div>
            </Container>
        );
    }
});

module.exports = SectionsCards;