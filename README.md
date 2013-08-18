idleTracking
===========

**Idle User tracking & Follow up Action**

Simple jQuery plugin to track time difference between the last active time stamp and current time to determine an idle user. If you need a solution that will work on devices that suspend the browser (e.g iOS) or can't rely on a user being logged out by the server on browser load, then hopefully my plugin will work for you. This plugin is modeled after Paul Irish's idleTimer and Eric Hynd's idleTracking and can coexist and work together for a bullet proof solution.

**Give Me Your Feedback**

I want to hear from you, where can we improve this plugin?

**Demo Page Coming soon**

sorry!

**Usage**

A user is considered active with the following events

mousemove, keydown, DOMMouseScroll, mousewheel, mousedown, touchstart, touchmove

Since localStorage support is pretty good
we store a date and time stamp and update them on the events above

* http://www.html5rocks.com/en/features/storage

As a fall back we also use data attributes

```javascript
//Call defaults to 15 min timeout & redirect to /logout
$.idleTracking();

//Set timeout 20 min
$.idleTracking({ timeout : 20 });

//Set window location on timeout
$.idleTracking({ logout : 'index.php' });

//or Call your own function on idle
$.idleTracking({
    onIdle : function() {
        //fire when idle
        //You can call the logout method too
        this.logout();
    }
});

//Clean up the timestamp
//Using the internal logout method will clean up after itself
//but if you don't use it you need to clean up
//removes localStorage and data attributes
$.idleTracking.clean();

//You can also call the logout method
//remember to set your logout : 'options'
$.idleTracking.logout();

//This one's in case you need to reset the time stamp
$.idleTracking.reset();

});
```

**Potential Dangers**

* Data attributes are refreshed on reload, so be careful relying on this fall back.

*Example*

* iOS full screen web apps refresh every time they're launched.  Thankfully we can rely on localStorage to store when the user was active last and on load determine if we need to log out the user or any other action.





