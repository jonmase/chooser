import React from 'react';

function FieldsWrapper(WrappedComponent) {
    return React.createClass({
        getDefaults: function(exclude, types) {
            var allDefaults = [
                {
                    name: "code",
                    label: "Code",
                    type: "text",
                },
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                },
                {
                    name: "description",
                    label: "Description",
                    type: "wysiwyg",
                },
                {
                    name: "min_places",
                    label: "Min. Places",
                    type: "number",
                },
                {
                    name: "max_places",
                    label: "Max. Places",
                    type: "number",
                },
                {
                    name: "points",
                    label: "Points",
                    type: "number",
                },
            ];
            
            var excludeNotSet = (typeof(exclude) === "undefined" || exclude === null);
            var typesNotSet = (typeof(types) === "undefined" || types === null);
            
            //If exclude and types both undefined, return all the fields
            if(excludeNotSet && typesNotSet) {
                return allDefaults;
            }
            //Otherwise loop through fields and only include the ones that aren't excluded or match the types
            else {
                var defaults = [];
                
                allDefaults.forEach(function(field) {
                    //If exclude undefined, or field not excluded and types is undefined or field type is in types array, add it to defaults
                    if((excludeNotSet || exclude.indexOf(field.name) === -1) && (typesNotSet || types.indexOf(field.type) > -1)) {
                        defaults.push(field);
                    }
                });
                
                return defaults;
            }
        },
        
        getDefaultsForChoice: function(choice, exclude, types) {
            var defaults = this.getDefaults(exclude, types);
            
            var choiceDefaults = [];
            defaults.forEach(function(field) {
                if(choice['use_' + field.name]) {
                    choiceDefaults.push(field);
                }
            });
            
            return choiceDefaults;
        },
        
        getTextFieldTypes: function() {
            var textTypes = ['text','wysiwyg','email','url'];
            
            return textTypes;
        },
        
        getTypes: function() {
            var fieldTypes = [
                {
                    value: 'text',
                    label: 'Simple Text',
                },
                {
                    value: 'wysiwyg',
                    label: 'Rich Text',
                },
                {
                    value: 'list',
                    label: 'Option List',
                },
                {
                    value: 'number',
                    label: 'Number',
                },
                {
                    value: 'email',
                    label: 'Email',
                },
                {
                    value: 'url',
                    label: 'URL',
                },
                {
                    value: 'date',
                    label: 'Date',
                },
                {
                    value: 'datetime',
                    label: 'Date & Time',
                },
                /*{
                    value: 'person',
                    label: 'Person',
                },*/
                /*{
                    value: 'file',
                    label: 'File Upload',
                },*/
            ];
            
            return fieldTypes;
        },
        
        render: function() {
            var newProps = {
                allDefaultFields: this.getDefaults(),
                getDefaultFields: this.getDefaults,
                getDefaultFieldsForChoice: this.getDefaultsForChoice,
                getFieldTypes: this.getTypes,
                textFieldTypes: this.getTextFieldTypes(),
            }
            
            return (
                <WrappedComponent {...this.props} {...newProps} />
            );
        }
    });
}

module.exports = FieldsWrapper;