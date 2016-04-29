import React from 'react';
import AlloyEditor from 'alloyeditor';

var selections = [
    {
        name: 'link',
        buttons: ['linkEdit'],
        test: AlloyEditor.SelectionTest.link
    },
    {
        name: 'image',
        buttons: ['imageLeft', 'imageRight'],
        test: AlloyEditor.SelectionTest.image
    },
    {
        name: 'text',
        buttons: ['styles', 'bold', 'italic', 'underline', 'subscript', 'superscript', 'ul', 'ol', 'link'], //Removed 'twitter'
        test: AlloyEditor.SelectionTest.text
    },
    {
        name: 'table',
        buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
        getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
        setPosition: AlloyEditor.SelectionSetPosition.table,
        test: AlloyEditor.SelectionTest.table
    }
];

var toolbars = {
    add: {
        buttons: ['image', 'link', 'hline', 'table'],   //Removed 'camera', added 'link'
        tabIndex: 2
    },
    styles: {
        selections: selections,
        tabIndex: 1
    }
};

var WysiwygField = React.createClass({
    componentDidMount: function() {
        this._editor = AlloyEditor.editable(this.props.container, {toolbars: toolbars});
    },

    componentWillUnmount: function() {
        this._editor.destroy();
    },
    

    render: function() {
        return (
            <div className="alloy-container">
                <label>
                    {this.props.label}<br />
                    <span className="sublabel">{this.props.sublabel}</span>
                </label>
                {/* //Use dangerouslySetInnerHTML to prevent invariant errors */}
                <div id={this.props.container} dangerouslySetInnerHTML={{__html: '<p></p><p></p>'}}>
                </div>
            </div>
        );
    }
});

module.exports = WysiwygField;