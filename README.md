# HTML `DataView` Box

This is a prototype of/an experiment in building an HTML component for displaying
the contents of a `DataView` with scroll support. The `DataView` might contain a
lot of data, so we cannot create HTML elements for the entirety of its contents,
but we can display just the visible part and size the container so that it displays
a scrollbar corresponding to how tall it would be if we did create elements for
the entirety of the `DataView` content. This is also known as list virtualization
more generically. With that, we can query the scrollbar position and extract the
corresponding portion of the `DataView` of the length given by the visible area.
This keeps the number of elements needed constant with respect to the visible
area.

---

Right now I am experimenting with drawing lines until the last one overflow and
using the amount of visible lines to determine the total required height, then
adjusting the heights of a head padding and foot padding elements to make the
container reach that height so that the scrollbar appears as if the whole container
was filled with lines.

It doesn't work as needed yet, but when tweaked, the idea is that the visible
lines will slide so that they are practically fixed in view even as the user
scrolls up (head padding decreases, foot padding increases) and down (head padding
increases, foot padding decreases). From the scroll position, it will then be
possible to determine what the number of the first and all subsequent lines
should be and the correct segment of the data view will be fetched.

Of course the lines shouldn't stay stuck and just flicker with new values as the
user scroll so we will need to introduce a stepping behavior where the head and
foot padding doesn't react harmonically to the scroll position but instead is
slightly adjusted further within the height of a single line so that the lines
appear as if they were scrolling past. But when one reaches the position of its
prev/next one, their do not actually get that far and instead their content
switches giving the appearance of fluent scrolling.

This is different to regular list virtualization but I think it could be interesting
to implement and I can always get back to normal list virtualization (pop elements
that go out of screen and put them to the gap their being-scrolled-away has
created with them again but with different content this time).
