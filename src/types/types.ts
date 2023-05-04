export type Book = {
  title: string,
  author: string,
  explanation: string,
  date_generated: string,
}

export type ReadBook = {
  title: string,
  author: string,
  rating: number,
  dateCompleted?: string,
};

export type SearchBook = {
  id: string
  title: string
  author: string
}

export type GoodreadsCSVRow = {
  "Book Id": string,
  "Title": string,
  "Author": string,
  "Author l-f": string,
  "Additional Authors": string,
  "ISBN": string,
  "ISBN13": string,
  "My Rating": string,
  "Average Rating": string,
  "Publisher": string,
  "Binding": string,
  "Number of Pages": string,
  "Year Published": string,
  "Original Publication Year": string,
  "Date Read": string,
  "Date Added": string,
  "Bookshelves": string,
  "Bookshelves with positions": string,
  "Exclusive Shelf": string,
  "My Review": string,
  "Spoiler": string,
  "Private Notes": string,
  "Read Count": string,
  "Owned Copies": string,
}
