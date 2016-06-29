import React from 'react';
import AlloyEditor from 'alloyeditor';

import FormsyTextarea from '../fields/textarea.jsx';

import FieldLabel from '../elements/label.jsx';

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
        var field = this.props.field;

        this._editor = AlloyEditor.editable(field.name, {toolbars: toolbars});
        var nativeEditor = this._editor.get('nativeEditor');
        
        if(typeof(field.onChange) === 'function') {
            nativeEditor.on('change', function(e) {
                var data = nativeEditor.getData();
                field.onChange(field.name, data);
            }); 
        }
        nativeEditor.on('focus', function(e) {
            this.onFocus();
        }, this); 
        nativeEditor.on('blur', function(e) {
            this.onBlur();
        }, this); 
    },

    componentWillUnmount: function() {
        this._editor.destroy();
    },

    getInitialState: function () {
        return {
            focused: false,
        };
    },
    
    onFocus: function() {
        this.setState({
            focused: true,
        });
    },
    
    onBlur: function() {
        this.setState({
            focused: false,
        });
    },
    
    render: function() {
        var field = this.props.field;
        if(!field.value) {
            field.value = "<br />&nbsp;";
        }
        
        return (
            <div className={(field.section?'section ':'') + (this.state.focused?'focused ':'') + 'alloy-container'}>
				<FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                {/* //Create Formsy textarea component, otherwise got errors about missing name on input field */}
                <FormsyTextarea name={field.name} value={field.value} />
            </div>
        );
    }
});

module.exports = WysiwygField;