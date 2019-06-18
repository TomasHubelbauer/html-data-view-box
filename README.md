# HTML `DataView` Box

[**DEMO**](https://tomashubelbauer.github.io/html-data-view-box)

This is a prototype of/an experiment in building an HTML component for displaying
the contents of a `DataView` with scroll support. The `DataView` might contain a
lot of data, so we cannot create HTML elements for the entirety of its contents,
but we can display just the visible part and size the container so that it displays
a scrollbar corresponding to how tall it would be if we did create elements for
the entirety of the `DataView` content.

This is also known as list virtualization more generically. With that, we can query
the scrollbar position and extract the corresponding portion of the `DataView` of
the length given by the visible area. This keeps the number of elements needed constant
with respect to the visible area.

- Adjust the number of rows on the fly (add/remove if viewport change)
- Reorder existing rows instead of rewriting the contents of all each time
  - Move first to last if first came off screen and update it, leave rest intact
  - Do the same group-wise if more then 1 went off-screen
- Test this on mobile and try to fix this based on mobile testing feedback
- See if flex on the line might be faster than `display: inline-block` on the spans
- Consider introducing a toggle for the stick-line behavior
  - If enabled, the first line will be scrolled in accordance to the scrollbar
    position, not stuck on top of the container reflecting the minute changes in
    scroll instead of just flickering with new values
- Make the number of cells configurable
- Consider making this a custom DOM element
  - https://developer.mozilla.org/en-US/docs/Web/Web_Components
  - https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
  - https://caniuse.com/#feat=custom-elementsv1
