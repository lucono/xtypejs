/** @license | xtypejs-name-scheme-camel v{{ LIB_VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
 */

/**
 * The MIT License (MIT)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
(function(root, xtypejs, undefined) {
    
    'use strict';

    var Object = ({}).constructor || Object,
        objFreeze = Object.freeze,
        schemeName = 'compact',
    
        nameScheme = {
            
            // -- Absent --
            'null': 'null',
            'undefined': 'undef',
            nan: 'nan',
            
            // -- Boolean --
            boolean: 'bool', 
            'true': 'true',
            'false': 'false',
            
            // -- String --
            string: 'str', 
            empty_string: 'str0',
            whitespace: 'str_',
            single_char_string: 'str1',
            multi_char_string: 'str2+',
            blank_string: 'str0_',
            non_empty_string: '-str0',
            non_blank_string: '-str0_',

            // -- Number --
            number: 'num',
            positive_number: 'num+', 
            negative_number: 'num-',
            zero: 'num0',
            
            non_positive_number: '-num+',
            non_negative_number: '-num-',
            non_zero_number: '-num0',
            
            integer: 'int',
            positive_integer: 'int+', 
            negative_integer: 'int-', 

            float: 'float',
            positive_float: 'float+', 
            negative_float: 'float-',

            infinite_number: 'inf', 
            positive_infinity: 'inf+', 
            negative_infinity: 'inf-',
            non_infinite_number: '-inf',
            
            // -- Array --
            array: 'arr', 
            empty_array: 'arr0', 
            single_elem_array: 'arr1',
            multi_elem_array: 'arr2+',
            non_empty_array: '-arr0',
            
            // -- Object --
            object: 'obj', 
            empty_object: 'obj0',
            single_prop_object: 'obj1',
            multi_prop_object: 'obj2+',
            non_empty_object: '-obj0',
            
            // -- Other --
            symbol: 'symb',
            date: 'date', 
            error: 'err', 
            regexp: 'regex',
            'function': 'func',
            
            nothing: 'nil', 
            primitive: 'prim',
            any: 'any',
            none: 'none'
        };
    
    
    /*
     * Export module
     */

    var LIB_NAME = 'xtypejsCompactNameScheme',
        moduleExport = nameScheme;
    
    
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return objFreeze(moduleExport);
        });
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = objFreeze(moduleExport);
    } 
    else {
        if (xtypejs && xtypejs.ext && typeof xtypejs.ext.registerNameScheme === 'function') {
            xtypejs.ext.registerNameScheme(schemeName, nameScheme);
            return;
        }
        moduleExport.noConflict = (function(previouslyDefinedValue) {
            return function() {
                root[LIB_NAME] = previouslyDefinedValue;
                delete moduleExport.noConflict;
                return moduleExport;
            };
        })(root[LIB_NAME]);
        
        root[LIB_NAME] =  objFreeze(moduleExport);
    }
    
})(this, (typeof xtype !== 'undefined' ? xtype : undefined));
