## Swipe JS

### Usage

```js
// History back. 
(new Swipe(document, {
    threshold: 100,
    position: 'bottom:30'
})).right(function() { 
    if (document.referrer.indexOf(window.location.host) !== -1) {
        window.history.back();
    }
}).run();

// History forward.
(new Swipe(document, {
    threshold: 100,
    position: 'bottom:30'
})).left(function() { 
    window.history.forward();
}).run();
```
