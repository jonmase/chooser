import React from 'react';
import Dropzone from 'react-dropzone';

import FieldLabel from '../elements/label.jsx';

var styles = {
    basic: {
        height: '50px',
        textAlign: 'center',
        padding: '1px',
        border: '1px dashed rgb(224, 224, 224)',
        color: 'rgba(0, 0, 0, 0.298039)',
    },
    active: {
        padding: '0px',
        border: '2px solid rgb(0, 150, 136)',
        color: 'rgb(0, 150, 136)',
    },
    container: {
        width: '50%',
    },
    instructions: {
        lineHeight: '50px',
    }
};

var FileField = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    onDrop: function (files) {
        console.log('Received files: ', files);
    },
    onDragEnter: function () {
        console.log('drag enter');
    },
    onDragLeave: function () {
        console.log('drag exit');
    },
    render: function() {
        var field = this.props.field;
        
        return (
            <div className={field.section?'section row':'row'}>
                <div className="col-xs-12 col-md-8 col-lg-6">
                    <FieldLabel
                        label={field.label}
                        instructions={field.instructions}
                    />
                    <Dropzone onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} style={styles.basic} activeStyle={styles.active}>
                        <div style={styles.instructions}>Drop files here, or click to select files</div>
                    </Dropzone>
                </div>
            </div>
        );
    }
});

module.exports = FileField;