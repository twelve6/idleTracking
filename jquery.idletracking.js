/*
 * jQuery idleTracking 1.0
 * 2013 Luis Ramirez
 *
 * Depends:
 *  - jQuery 1.4.2+
 * Plays Well with:
 *  - jQuery Idle Timer (by Paul Irish, https://github.com/mikesherov/jquery-idletimer)
 *  - jQuery Idle Timeout (by Eric Hynds, http://www.erichynds.com/jquery/a-new-and-improved-jquery-idle-timeout-plugin/)
 *
 *
*/
;(function($, undefined){

    var idleTracking = {

        _localStorage : false,

        defaults : {
            timeout : 15,
            logout : '/logout',
            onReset: $.noop,
            onIdle: $.noop
        },

        settings :  {},

        init    :   function(opt) {
            var self = idleTracking;
            self.settings = $.extend({}, self.defaults, opt);
            //check for localStorage support
            self._localStorage = self._localStorageTest();
            //attach our events
            self._events();
            //Check for idle user
            self._checkIdleUser();
            //expose our object
            // $.data(document, 'idleTracking', self);
        },

        _localStorageTest   :   function() {
            var self = idleTracking;
            //thanks modernizr
            try {
                localStorage.setItem('mod', 'mod');
                localStorage.removeItem('mod');
                return true;
            } catch(e) {
                return false;
            }
        },

        _checkIdleUser  :   function() {
            var self = idleTracking;
            var obj = {};

            if (self._localStorage) {
                obj = self._getDataStorage();
            } else {
                obj = self._getDataAttr();
            }

            if (obj.timeStamp !== null && obj.dateStamp !== null) {

                var newDate = new Date();
                var date = (newDate.getUTCMonth() + 1) + '' + newDate.getUTCDate() + '' + newDate.getUTCFullYear();
                var time = newDate.getTime();

                if(date !== obj.dateStamp || time - obj.timeStamp > (self.settings.timeout * 60) * 1000) {
                    self.settings.onIdle.call(self);
                }
            }
            setTimeout(self._checkIdleUser, 1000);
        },

        _getDataStorage     :   function() {
            var obj = {};
            obj['dateStamp'] = localStorage.getItem('idleDate');
            obj['timeStamp'] = localStorage.getItem('idleTime');
            return obj;
        },

        _getDataAttr    :   function() {
            obj = {};
            obj['dateStamp'] = $(document).data('idleDate');
            obj['timeStamp'] = $(document).data('idleTime');
            return obj;
        },

        _events     :   function() {
        var self = idleTracking;
            //assign appropriate event handlers
            var events  = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove';
            $(document).bind(events, function() {
                self._timeStamp();
            });
        },

        _timeStamp :    function() {
            var self = idleTracking;
            var newDate = new Date();
            var date = (newDate.getUTCMonth() + 1) + '' + newDate.getUTCDate() + '' + newDate.getUTCFullYear();
            var time = newDate.getTime();

            if (self._localStorage) {
                localStorage.setItem('idleDate', date);
                localStorage.setItem('idleTime', time);
            }

            $(document).data('idleTime', time);
            $(document).data('idleDate', date);
        },

        houseKeeping   :   function() {
            var self = idleTracking;
            //we might need to call this method, before init
            //so we need to check support
            self._localStorage = self._localStorageTest();

            //we have to remove idleTime otherwise it will persist
            if (self._localStorage) {
                localStorage.removeItem('idleTime');
                localStorage.removeItem('idleDate');
            }
            $(document).removeData('idleTime');
            $(document).removeData('idleDate');
        },

        logout :    function() {
            var self = idleTracking;
            self.houseKeeping();
            window.location = self.settings.logout;
        },

        reset   :   function() {
            var self = idleTracking;
            self._timeStamp();
            self.settings.onReset.call(this);
        }
    };

    //expose
    $.idleTracking = function(opt) {
        idleTracking.init(opt);
        return this;
    };
    //clean house
    $.idleTracking.clean = function() {
        idleTracking.houseKeeping();
        return this;
    };
    //expose our logout
    $.idleTracking.logout = function() {
        idleTracking.logout();
        return this;
    };
    //expose our reset
    $.idleTracking.reset = function() {
        idleTracking.reset();
        return this;
    };

})(jQuery);//end