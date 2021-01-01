var $_static = {

    myPublicStaticVariable: {

        value: 1,
        visibility: "public"

    },

    myProtectedStaticVariable: {

        value: 2,
        visibility: "protected"

    },

    myPublicStaticFunction: {
        
        value: function() {

            console.log("\nThis is my public static function.");
            console.log("this.myPublicStaticVariable: " + this.myPublicStaticVariable);
            console.log("this.myProtectedStaticVariable: " + this.myProtectedStaticVariable);
            console.log("this.myPublicInstanceFunction: " + this.myPublicInstanceFunction);
            console.log("this.myProtectedInstanceFunction: " + this.myProtectedInstanceFunction + "\n");

        },
        visibility: "public"

    },

    myProtectedStaticFunction: {

        value: function() {

            console.log("\nThis is my protected static function.");
            console.log("this.myPublicStaticVariable: " + this.myPublicStaticVariable);
            console.log("this.myProtectedStaticVariable: " + this.myProtectedStaticVariable);
            console.log("this.myPublicInstanceFunction: " + this.myPublicInstanceFunction);
            console.log("this.myProtectedInstanceFunction: " + this.myProtectedInstanceFunction + "\n");

        },
        visibility: "protected"

    }

};

var $_instance = {

    myPublicInstanceVariable: { 

        value: 3, 
        visibility: "public"

    },

    myProtectedInstanceVariable: { 

        value: 4, 
        visibility: "protected"

    },

    myPublicInstanceFunction: {
        
        value: function() {

            console.log("\nThis is my public instance function.");
            console.log("this.myPublicStaticVariable: " + this.myPublicStaticVariable);
            console.log("this.myProtectedStaticVariable: " + this.myProtectedStaticVariable);
            console.log("this.myPublicInstanceFunction: " + this.myPublicInstanceFunction);
            console.log("this.myProtectedInstanceFunction: " + this.myProtectedInstanceFunction + "\n");
            this.myPublicStaticFunction();
            this.myProtectedStaticFunction();

        },
        visibility: "public"

    },

    myProtectedInstanceFunction: {
        
        value: function() {

            console.log("\nThis is my protected instance function.");
            console.log("this.myPublicStaticVariable: " + this.myPublicStaticVariable);
            console.log("this.myProtectedStaticVariable: " + this.myProtectedStaticVariable);
            console.log("this.myPublicInstanceFunction: " + this.myPublicInstanceFunction);
            console.log("this.myProtectedInstanceFunction: " + this.myProtectedInstanceFunction + "\n");
            this.myPublicStaticFunction();
            this.myProtectedStaticFunction();
            this.myPublicInstanceFunction();

        },
        visibility: "protected"

    }

};

var myClass = function($static, $instance, $unboundClassContructor) {
    
    // make sure that this function isn't called
    // using the new operator

    if(global && this !== global) {

        throw {

            message: "function myClass($static, $instance, $unboundClassContructor)"
            + " cannot be called using the new operator"

        };

    }

    // create the static scope

    var $_staticScope = {};

    // static properties are accessed via special
    // getters and setters defined on the this 

    for(var key in $static) {

        // copy $static[key].value to $_staticScope[key]

        $_staticScope[key] = $static[key].value;

        // bind if it's an instance of Function 
        // $_static[key].value to $staticScope and 
        // copy it to $_classScopeContructor.prototype

        if ($static[key].value instanceof Function) {

            $_classScopeConstructor.prototype[key] = (

                $static[key].value

            ).bind($_staticScope);

        } 

    }

    // instance methods are copied to
    // $_classScopeConstructor.prototype directly 
    
    for (var key in $instance) {

        // if the $_instance[key].value is a Function 
        // instance copy it directly to 
        // $_classScopeConstructor.prototype

        if ($instance[key].value instanceof Function) {

            $_classScopeConstructor.prototype[key] = $instance[key].value;

        } 

    }

    // class scope constructor

    function $_classScopeConstructor() {        

        // static methods are bound to $_static and 
        // copied to $_classScopeConstructor.prototype 

        for (var key in $_staticScope) {

            if (! ($_staticScope[key] instanceof Function)) {

                // if $_staticScope[key] isn't an instance of
                // Function define a property on this for the 
                // static property to be accessed by using 
                // special getters and setters

                // use an anonymous self executing function to
                // capture key and make sure it is unique each
                // time a getter or a setter is used for static
                // properties

                (function($this, $propertyKey) {

                    Object.defineProperty($this, $propertyKey, {

                        configurable: false,
                        enumerable: true,
                        get() {
            
                            return $_staticScope[$propertyKey];
            
                        },
                        set(value) {
            
                            $_staticScope[$propertyKey] = value;
            
                        }
            
                    });

                })(this, key);

            }

        }

        // instance properties are directly copied to 
        // this as class scope members

        for (var key in $instance) {

            if (! ($instance[key].value instanceof Function)) {

                this[key] = $instance[key].value;
            
            }

        }        

    }

    return function(...$classConstructorArguments) {

        // create an instance of $_classScopeConstructor

        var $_classScopeInstance = new $_classScopeConstructor();

        // bind the unbound Class constructor to the
        // created instance of $_classScopeConstructor
        // and execute 

        ($unboundClassContructor.bind($_classScopeInstance))($classConstructorArguments);            

        // return the new _classScope instance after
        // running a bound Class constructor is run
        // on it as the execution scope

        return $_classScopeInstance;
        
    };
    
}

var myClassConstructor = myClass($_static, $_instance, function() {

    this.myProtectedInstanceFunction();

});

var myClassInstance = new myClassConstructor();