'use strict';

var Class = {};

Class.assert = function( value, message ){
    if( !value ){
        throw message;
    }
}

Class.extend = function(target_object, source_object){
    var prop_name;
    for( prop_name in source_object ){
        if( source_object.hasOwnProperty(prop_name) ){
            target_object[prop_name] = source_object[prop_name];
        }
    }
};

Class.create = function(){
    var super_class = Object, properties, initialize_values;

    if( typeof arguments[0] == "function" ){
        super_class = arguments[0];
        properties = arguments[1];
        initialize_values = arguments[2];
    }else{
        properties = arguments[0];
        initialize_values = arguments[1];
    }

    var new_class;
    
    Class.assert( typeof properties == "object", "Class.create() properties argument must be a object" );
    if( initialize_values ){
        Class.assert( typeof initialize_values == "object", "Class.create() initialize_values argument must be a object" );
    }

    if( properties.hasOwnProperty('initialize') ){
        if( initialize_values ){
            new_class = function(){
                Class.extend(this, initialize_values);
                return properties.initialize.apply(this, arguments);
            };
        }else{
            new_class = function(){
                return properties.initialize.apply(this, arguments);
            }
        }
    }else{
        if( initialize_values ){
            new_class = function(){
                Class.extend(this, initialize_values);
                return this;
            };
        }else{
            new_class = function(){
                return this;
            }
        }
    }

    new_class.prototype = Object.create(super_class.prototype);
    Class.extend( new_class.prototype, properties );
    return new_class;
};

exports.Class = Class;
