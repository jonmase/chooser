import React from 'react';

function SortWrapper(WrappedComponent) {
    return React.createClass({
        sort: function(items, field, fieldType, direction) {
            direction = direction.toLowerCase();
        
            items.sort(
                function(a, b) {
                    var textTypes = ['text', 'wysiwyg', 'list', 'email', 'url'];
                
                    var valueA = null;
                    var valueB = null;
                    
                    var fieldParts = field.split('.');
                    
                    //Get the field, based on the number of parts
                    if(fieldParts.length === 1) {
                        var fieldA = a[field];
                        var fieldB = b[field];
                    }
                    else if(fieldParts.length === 2) {
                        var fieldA = a[fieldParts[0]][fieldParts[1]];
                        var fieldB = b[fieldParts[0]][fieldParts[1]];
                    }
                    else if(fieldParts.length === 3) {
                        var fieldA = a[fieldParts[0]][fieldParts[1]][fieldParts[2]];
                        var fieldB = b[fieldParts[0]][fieldParts[1]][fieldParts[2]];
                    }
                    //Don't think there's any need to go beyond 3
                
                    //TODO: Deal with list types better 
                    if(fieldType === 'date') {
                        if(fieldA) {
                            var dateA = fieldA.date;
                            valueA = new Date(parseInt(dateA.year), parseInt(dateA.month) - 1, parseInt(dateA.day));
                        }

                        if(fieldB) {
                            var dateB = fieldB.date;
                            valueB = new Date(parseInt(dateB.year), parseInt(dateB.month) - 1, parseInt(dateB.day));
                        }
                    }
                    else if(fieldType === 'datetime') {
                        if(fieldA) {
                            var dateA = fieldA.date;
                            var timeA = fieldA.time;
                            valueA = new Date(parseInt(dateA.year), parseInt(dateA.month) - 1, parseInt(dateA.day), parseInt(timeA.hour), parseInt(timeA.minute), 0);
                        }

                        if(fieldB) {
                            var dateB = fieldB.date;
                            var timeB = fieldB.time;
                            valueB = new Date(parseInt(dateB.year), parseInt(dateB.month) - 1, parseInt(dateB.day), parseInt(timeB.hour), parseInt(timeB.minute), 0);
                        }
                    }
                    else if(fieldType === 'number') {
                        if(fieldA) {
                            valueA = fieldA;
                        }
                        if(fieldB) {
                            valueB = fieldB;
                        }
                    }
                    else if(fieldType === 'checkbox') {
                        //Checkbox options should be in alphabetical order, so can concatenate the selected values for each option then compare
                        valueA = '';
                        for(var value in fieldA) {
                            if(fieldA[value]) {
                                valueA += value.toUpperCase();
                            }
                        }
                        
                        valueB = '';
                        for(var value in fieldB) {
                            if(fieldB[value]) {
                                valueB += value.toUpperCase();
                            }
                        }
                    }
                    //if(textTypes.indexOf(fieldType) > -1) {
                    else {  //Otherwise, assume text search
                        if(fieldA) {
                            valueA = fieldA.toUpperCase(); // ignore upper and lowercase
                        }
                        if(fieldB) {
                            valueB = fieldB.toUpperCase(); // ignore upper and lowercase
                        }
                    }
                    
                    
                    if (valueA < valueB) {
                        return (direction === 'asc')?-1:1;
                    }
                    if (valueA > valueB) {
                        return (direction === 'asc')?1:-1;
                    }

                    // values must be equal
                    return 0;
                }
            );
            
            return items;
        },
        
        deepCopy: function(o) {
            var copy = o,k;
         
            if (o && typeof o === 'object') {
                copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
                for (k in o) {
                    copy[k] = this.deepCopy(o[k]);
                }
            }
         
            return copy;
        },
        
        updateIndexesById: function(items, idField) {
            if(!idField) {
                idField = 'id';
            }
            var itemIndexesById = {};
            items.forEach(function(item, index) {
                itemIndexesById[item[idField]] = index;
            });
            
            return itemIndexesById;
        },

        render: function() {
            var newProps = {
                deepCopyHelper: this.deepCopy,
                sortHelper: this.sort,
                updateIndexesByIdHelper: this.updateIndexesById,
            }
            
            return (
                <WrappedComponent {...this.props} {...newProps} />
            );
        }
    });
}

module.exports = SortWrapper;