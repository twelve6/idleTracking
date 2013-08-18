idleTracking
===========

**Idle User tracking & Follow up Action**

Simple jQuery plugin to track time difference between the last active time stamp and current time to determine an idle user. If you need a solution that will work on devices that suspend the browser (e.g iOS) or can't rely on a user being logged out by the server on browser load (e.g Chrome's Continue where I left off setting), then hopefully my plugin will work for you. This plugin is modeled after Paul Irish's idleTimer and Eric Hynd's idleTracking and can coexist and work together for a bullet proof solution.

**Why?**

I came up with this solution because I needed a reliable way to boot a user after a certain time of inactivity or let the user continue if within the time limit. Most solutions I found didn't take suspended or inactive browsers in to consideration and thus let the user continue usage even if they had been away for hours. Here the second we return from a suspended state, we can check how long its been and act accordingly.

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
//Simple Call: defaults to 15 min timeout & redirects to /logout
$.idleTracking();

//Set timeout 20 min
$.idleTracking({ timeout : 20 });

//Set window location on timeout
$.idleTracking({ logout : 'logout.php' });

//or Call your own function on idle
$.idleTracking({
    onIdle : function() {
        //fire when idle
        //You can call the logout method too
        this.logout();
    }
});

//Clean up the time stamp
//Using the internal logout method will clean up after itself
//but if you don't use it you need to clean up
//removes localStorage and data attributes
$.idleTracking.clean();

//You can also call the logout method
//remember to set your logout : 'options'
$.idleTracking.logout();

//This one's in case you need to update the time stamp
//Hint: I update the time stamp while a video is playing
$.idleTracking.update();

//Call a function onUpdate
$.idleTracking({
    onUpdate : function() {
        //fire onUpdate
    }
});

```

**Potential Dangers**

* Data attributes are refreshed on reload, so be careful relying on this fall back.

*Example*

* iOS full screen web apps refresh every time they're launched.  Thankfully we can rely on localStorage to store when the user was active last and on load determine if we need to log out the user or any other action.





