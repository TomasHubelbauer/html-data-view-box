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

- Change layout to be columns side by side to allow automatic widths and global styling of all column cells
- Add an attribute for the number of cells (default based on viewport)
- Adjust the number of rows automatically if dimensions change (add/remove)
- Recycle rows that go out of view and generally shift and reuse rows in group
  instead of updating all rows all the time the line index per scroll changes
- See if flex on the line might be faster than `display: inline-block` on the spans
- Consider introducing a toggle for the stick-line behavior:
  if enabled, the first line will be scrolled in accordance to the scrollbar
  position, not stuck on top of the container reflecting the minute changes in
  scroll instead of just flickering with new values
- Fix performance issues now that the view contains all of hex, dec and ASCII
- Refactor the web component to use class fields more intelligently, maybe even private ones if supported well
- Wrap everything currently in the shadow DOM in one more `div` to apply the `padding` to so it doesn't leak out
