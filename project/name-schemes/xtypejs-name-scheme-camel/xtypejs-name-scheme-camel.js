/** @license | xtypejs-name-scheme-compact v{{ LIB_VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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
        schemeName = 'camel',
    
        nameScheme = {

            // -- Absent --
            'null': 'null',
            'undefined': 'undefined',
            nan: 'nan',
            
            // -- Boolean --
            boolean: 'boolean', 
            'true': 'true',
            'false': 'false',
            
            // -- String --
            string: 'string', 
            empty_string: 'emptyString',
            whitespace: 'whitespace',
            single_char_string: 'singleCharString',
            multi_char_string: 'multiCharString',
            blank_string: 'blankString',
            non_empty_string: 'nonEmptyString',
            non_blank_string: 'nonBlankString',
            
            // -- Number --
            number: 'number',
            positive_number: 'positiveNumber', 
            negative_number: 'negativeNumber',
            zero: 'zero',

            non_positive_number: 'nonPositiveNumber',
            non_negative_number: 'nonNegativeNumber',
            non_zero_number: 'nonZeroNumber',

            integer: 'integer',
            positive_integer: 'positiveInteger', 
            negative_integer: 'negativeInteger',

            float: 'float',
            positive_float: 'positiveFloat', 
            negative_float: 'negativeFloat',

            infinite_number: 'infiniteNumber', 
            positive_infinity: 'positiveInfinity', 
            negative_infinity: 'negativeInfinity',
            non_infinite_number: 'nonInfiniteNumber',
            
            // -- Array --
            array: 'array', 
            empty_array: 'emptyArray', 
            single_elem_array: 'singleElemArray',
            multi_elem_array: 'multiElemArray',
            non_empty_array: 'nonEmptyArray',
            
            // -- Object --
            object: 'object', 
            empty_object: 'emptyObject',
            single_prop_object: 'singlePropObject',
            multi_prop_object: 'multiPropObject',
            non_empty_object: 'nonEmptyObject',
            
            // -- Other --
            symbol: 'symbol',
            date: 'date', 
            error: 'error', 
            regexp: 'regexp',
            'function': 'function',
            
            nothing: 'nothing', 
            primitive: 'primitive',
            any: 'any',
            none: 'none'
        };
    
    
    /*
     * Export module
     */

    var LIB_NAME = 'xtypejsCamelNameScheme',
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
