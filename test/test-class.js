var Class = require("../class").Class;

exports.classTest = {
    test_default_super_class_is_Object: function(test){
        test.expect(3);


        var A = Class.create({});

        test.ok( new A() instanceof Object );
        test.ok( new A() instanceof A );
        test.ok( A.prototype.constructor.prototype.constructor === Object );

        test.done();
    },

    test_properties_define_functions_and_fields : function(test){
        var intiailize_called = false;
        var A = Class.create({
            say : function(){
                return "say " + this._value;
            },

            _value : "Hello",

            _value_changed_by_initialize_values : "Origin",

            _value_changed_by_initialize : "Origin",

            _value_override_by_initilize : "Origin",

            initialize : function(b){
                initialize_called = true;
                this._value_changed_by_initialize = b;
                this._value_override_by_initilize = "initialize";
            },
        },
        {
            _value_changed_by_initialize_values : "Values",
            _value_added_by_initialize_values : "Values",
            _value_override_by_initilize : "Values",
        });

        test.expect(10);
        a = new A("Changed");

        //initialize will be called
        test.ok( initialize_called );
        
        //field define
        test.equal( a._value, "Hello" );

        //method define
        test.equal( a.say(), "say Hello" );

        //All the property defined in properties should belong to prototype, is not own property, unless override by initialized_value or initialize function.
        test.ok( !a.hasOwnProperty("say") );
        test.ok( !a.hasOwnProperty("_value") );

        //initialize will override value defined in properties
        test.equal( a._value_changed_by_initialize, "Changed" );
        test.ok( a.hasOwnProperty("_value_changed_by_initialize") );

        //initialize_values override or add value defined in properties and belongto this object only.
        test.equal( a._value_added_by_initialize_values, "Values" );
        test.equal( a._value_changed_by_initialize_values, "Values" );

        //initialize will override initialize_values
        test.equal( a._value_override_by_initilize, "initialize" );
        
        test.done();
    },

    test_inherite_from_super_class : function(test){
        var Base = Class.create({
            say : function(){
                return "Base" + this._b;
            },

            say2 : function(){
                return "Base";
            },

            initialize : function(b){
                this._b = b;
            },

            _c : "origin",
        },
        {
            _d : "good",
            _c : "override",
        });

        var Sub = Class.create(Base,{
            initialize : function(c){
                Base.call(this,c);
            },

            say2 : function(){
                return "Sub";
            }
        });

        var s = new Sub("2");

        test.expect(4);

        test.equal( s.say(), "Base2");
        test.equal( s.say2(), "Sub" );
        test.equal( s._d, "good" );
        test.equal( s._c, "override" );

        test.done();
    }
};
