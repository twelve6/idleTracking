/*
 * jQuery idleTracking 1.0
 * August 2013 Luis Ramirez
 *
 * Depends:
 *  - jQuery 1.4.2+
 * Plays Well with:
 *  - jQuery Idle Timer (by Paul Irish, https://github.com/mikesherov/jquery-idletimer)
 *  - jQuery Idle Timeout (by Eric Hynds, http://www.erichynds.com/jquery/a-new-and-improved-jquery-idle-timeout-plugin/)
 *
 * Licensed MIT
 *
*/
;(function($, undefined){

    var idleTracking = {

        _localStorage : false,

        defaults : {
            events  : 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove',
            timeout : 15,
            logout : '/logout',
            onUpdate: $.noop,
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
                //get our date and time object
                var cDate = self._createDate();

                if(cDate.date !== obj.dateStamp || cDate.time - obj.timeStamp > self.settings.timeout * 60000) {
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
            //bind event handlers
            $(document).bind(self.settings.events, function() {
                self._timeStamp();
            });
        },

        _timeStamp :    function() {
            var self = idleTracking;
            //get our date and time object
            var cDate = self._createDate();

            if (self._localStorage) {
                localStorage.setItem('idleDate', cDate.date);
                localStorage.setItem('idleTime', cDate.time);
            }

            $(document).data('idleDate', cDate.date);
            $(document).data('idleTime', cDate.time);
        },

        _createDate :   function() {
            var obj = {};
            var newDate = new Date();
            obj['date'] = (newDate.getUTCMonth() + 1) + '' + newDate.getUTCDate() + '' + newDate.getUTCFullYear();
            obj['time'] = newDate.getTime();
            return obj;
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

        update   :   function() {
            var self = idleTracking;
            self._timeStamp();
            self.settings.onUpdate.call(this);
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
    //expose our update
    $.idleTracking.update = function() {
        idleTracking.update();
        return this;
    };

})(jQuery);//end