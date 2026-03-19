# Books

The "rock star" version of this lab would be for you to explore ways to work with the data, and signals, computed, etc.

What we want is a "pleasing" list of the books, use a table, or cards, or whatever.

Then we want a section at the top of the list that provides some statistics about the books.

- Total Books
- Average number of pages
- Longest Book Length and Title(s) of those books.
- The earliest date of a book
- The latest date of the book.

Add an way to sort the books by:

- Title
- Author
- Year

Both ascending and descending.

**Below This Line** might be helpful, it might not. You do you.

The mock API has an endpoint at `/api/books`. It supports a `GET` request.

We want to create a component that lists out the data from the results of the HTTP call to this endpoint.

## Goal (if you want to think through this, and, you know _apply_ Angular)

You _may_ learn the most by _not_ trying to follow the step-by-step instructions below.

The `/api/books` endpoint returns a list of about a hundred books. We want a new feature in the application
that displays the list of books from the API on component.

We would like to display just the id, title, author and year of each book. Maybe you could display the results
in a table, or some grid like structure. See what works for you.

You can do pretty much _all_ of this in the component. Don't use a service or store or anything _yet_.

### In the `books/list` Component

We are showing the 'raw' JSON of the endpoint. Find a better way to display the data.
We don't want to show all the details of the book, just the id, title, author, and year of each book.

You could use a table, a grid of cards, whatever you think looks good. Go shopping on https://daisyui.com for inspiration and code to swipe.

### Pretend like this is the future, and "business" wants something else.

At the top of the list of books, display a component that you create that takes the books as an input, and generates
some statistics about them.

1. The total number of books.
2. The earliest year a book was published from our list.
3. The most recent year a book was published from our list.
4. The average number of pages of the books.

### Pretend like this is the "next sprint":

We want a way to sort the books by either title, author, or year released. By default it should be sorted by title.

Oh, and they want a "prefs" page in the feature where the user can configure what they want to sort by.
This should be persisted in local storage.

**Extra Credit If you Can Sort in both Ascending and Descending Order**.

### Pretend like this is the "next sprint"

However you are displaying the list of books, make it so that the title of the book is a hyperlink that takes them to another route that displays all the details of the book.

Add a page called `details.component.ts` to display _all_ of the data about that book. (id, title, author, country, language, pages, year, and links for the image (or show the image), and the link provided to the book)

### Final Sprint (Extra Credit)

We are considering letting users add books. Create a form that allows the user to add books, and the added book shows up in the list and is included in the stats.

If you have time, mock out the `post` handler in the mock service worker, so our API people know what to build.

> **Extra Credit**: Implement the Outbox "bucket" pattern to handle asynchronous operations as non-blocking.

## Steps

### 1. Create a Feature

I already did this for you. Remember this at course evaluation time. ;)

### 2. "ProtoType" - Getting the data

I already did this, too - see the `list.ts` component in pages/books.

Navigate to the route. We are using the Angular `resource` API to take a look at the data from the API.

You should see a JSON representation of the HTTP response body. Take note of the "shape" of the data.

Inspect the code displayed on the screen.

Create types to represent the code we need. (Maybe a BookEntity?)

In TypeScript, the types are for "us" and don't have anything to do with "reality" in the browser. They are just a way for the compiler to do some "checking" for us as we code, and give us some code completion.

We only care about the list of `BookEntity` - so update the resource definition in the component to look like this:

When you view the page now, you should just see the raw array of books.

Now, let's convert the raw data displayed into an HTML table that displays the id, title, author, and year.

Choose something that works for you from [DaisyUi](https://daisyui.com/components/table/) and use that.

## Statistics

We will _start_ with just embedding this in the same component.

Create a section at the top of the list that displays some statistics about the list of the books:

It should display:

- Total Number of Books
- The average number of pages of each book
- The total number of pages of all books

If you are feeling particularly spicey, try adding this to the statistics:

- The earliest year a book was published from our list
- The most recent year a book was published from our list

## Lifting State

So, the usability saw you amazing work, and like it, but think it's too "messy" so they want another link that will display the statistics.

1. In the `books` feature, create a couple of pages.
   1. `list.component.ts`
   2. `stats.component.ts`

Add them as child routes in `books.routes.ts`.

Make it so that it shows the `list.component.ts` by default, if no other route is specified. (look at our `app.routes.ts` for how we redirect to `home`).

Add links on the `books.component.ts` for the list, and the stats pages.

Extract the code that makes the API call and and displays the table to the `list.component.ts`.

In the `stats.component.ts` create some code that displays:

1. The total number of books.
2. The earliest year a book was published from our list.
3. The most recent year a book was published from our list.
4. The average number of pages of the books.

It is OK to use the resource code for this part and simply call the API again from this component. Since the resource returns an Signal, you can create `computed` values on this component to derive the values to display.

> Note: making multiple API calls to the same API Resource is fine. _If_ the data is just used to display. The API probably _SHOULD_ include a `cache-control` header, so the browser's cache will fulfill subsequent requests if they are within the "fresh" time.

## Draw the Rest of the Tick

This is going to get more complicated _quickly_.

### Make the Table Sortable

When the user clicks on a column header in the list of books, the list should be sorted by that column.

If they click on the title column, the table will be sorted alphabetically by title, for example.

If they click on the title column _again_ the table will be sorted in reverse alphabetical order.

Do the same thing for each of the columns.

> Hint: You can do this part in the component for now. Use signals, computed, etc.

### Create a "Prefs" component and route.

Add another page (`prefs.component.ts`) and add a route to it.

Create a UI affordance to allow the user to select their preference for how the table is sorted. (a dropdown? radio buttons?)

When they return to the list, it should be sorted by that selected value.

Oh, and when they click on a different column header and return to the `prefs` page, it should have automatically changed the preference to the column they selected.

Save this and retrieve it from localstorage so their preferences are persisted across browser refreshes.

### See the Details

On the list, make it so that each title becomes a hyperlink that takes them to a route that will show the details for that particular book. (so, for example, `../details/13`)

Add a page called `details.component.ts` to display _all_ of the data about that book. (id, title, author, country, language, pages, year, and links for the image (or show the image), and the link provided to the book)

The challenge here will be that our API does not allow you to request a single book at a time. You will have to do some **heavy** state lifting.

Suggestions:

- Create a service for the API call that has a way to load and retrieve the books (we will leave the `resource` api behind and move to the `HttpClient` and Observables as in the gift giving service.)

Create a store to hold the books as entities, and create a `_load` method that uses our service to load the books. Make it so that the books are loaded when the store is initialized.

Provide both the service and the books in the routes.

Add a method on the store to set the id of the currently selected book. This should be set from the `details` component when the component is initialized.

Created a `computed` value on the store that returns the book they selected. Display that book in the details.

If the `id` you read from the URL doesn't correspond to a book in the store, display a message telling them that the book isn't found, and give them a link to return to the list.

### Refactor the List and The Prefs Component

Have both of these components rely on the store for their "source of truth" about the books and their sorting preferences.

### Extra Credit

Make it so that every five seconds, the list of books is fetched again from the API "behind the scenes" to make sure the data is up to date.
