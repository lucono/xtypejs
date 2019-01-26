/** @license | xtypejs-name-scheme-shortened v0.1.1 | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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
        schemeName = 'shortened',
    
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
            empty_string: 'empty_str',
            whitespace: 'space',
            single_char_string: 'one_char_str',
            multi_char_string: 'multi_char_str',
            blank_string: 'blank_str',
            non_empty_string: 'non_empty_str',
            non_blank_string: 'non_blank_str',
            
            // -- Number --
            number: 'num',
            positive_number: 'pos_num', 
            negative_number: 'neg_num',
            zero: 'zero',

            non_positive_number: 'non_pos_num',
            non_negative_number: 'non_neg_num',
            non_zero_number: 'non_zero_num',

            integer: 'int',
            positive_integer: 'pos_int', 
            negative_integer: 'neg_int', 

            float: 'float',
            positive_float: 'pos_float', 
            negative_float: 'neg_float',

            infinite_number: 'inf', 
            positive_infinity: 'pos_inf', 
            negative_infinity: 'neg_inf',
            non_infinite_number: 'non_inf_num',
            
            // -- Array --
            array: 'arr', 
            empty_array: 'empty_arr', 
            single_elem_array: 'one_elem_arr',
            multi_elem_array: 'multi_elem_arr',
            non_empty_array: 'non_empty_arr',
            
            // -- Object --
            object: 'obj', 
            empty_object: 'empty_obj',
            single_prop_object: 'one_prop_obj',
            multi_prop_object: 'multi_prop_obj',
            non_empty_object: 'non_empty_obj',
            
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

    var LIB_NAME = 'xtypejsShortenedNameScheme',
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
