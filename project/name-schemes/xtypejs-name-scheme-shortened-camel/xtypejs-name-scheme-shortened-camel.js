/** @license | xtypejs-name-scheme-shortened-camel v{{ LIB_VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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
        schemeName = 'shortened-camel',
    
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
            empty_string: 'emptyStr',
            whitespace: 'space',
            single_char_string: 'oneCharStr',
            multi_char_string: 'multiCharStr',
            blank_string: 'blankStr',
            non_empty_string: 'nonEmptyStr',
            non_blank_string: 'nonBlankStr',
            
            // -- Number --
            number: 'num',
            positive_number: 'posNum', 
            negative_number: 'negNum',
            zero: 'zero',

            non_positive_number: 'nonPosNum',
            non_negative_number: 'nonNegNum',
            non_zero_number: 'nonZeroNum',

            integer: 'int',
            positive_integer: 'posInt', 
            negative_integer: 'negInt',

            float: 'float',
            positive_float: 'posFloat', 
            negative_float: 'negFloat',

            infinite_number: 'inf', 
            positive_infinity: 'posInf', 
            negative_infinity: 'negInf',
            non_infinite_number: 'nonInfNum',
            
            // -- Array --
            array: 'arr', 
            empty_array: 'empArr', 
            single_elem_array: 'oneElemArr',
            multi_elem_array: 'multiElemArr',
            non_empty_array: 'nonEmpArr',
            
            // -- Object --
            object: 'obj', 
            empty_object: 'empObj',
            single_prop_object: 'onePropObj',
            multi_prop_object: 'multiPropObj',
            non_empty_object: 'nonEmpObj',
            
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

    var LIB_NAME = 'xtypejsShortenedCamelNameScheme',
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
