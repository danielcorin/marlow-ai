import { ReadBook, SearchBook } from '@/types/types'
import { Input, Dropdown, InputRef } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { MenuProps } from 'antd'

const { Search } = Input
type Props = {
  addRead: (record: ReadBook) => void
}

const booksToItems = (books: SearchBook[], callback: (book: SearchBook) => void): MenuProps['items'] => {
  if (books.length === 0) {
    return [{
      key: 0,
      label: (
        <div>No results found</div>
      ),
      disabled: true,
    }]
  }
  return books.map((book, i) => {
    return {
      key: i,
      label: (
        <div onClick={() => callback(book)}>{`${book.title} — ${book.author}`}</div>
      ),
    }
  })
}

export const BookSearch: React.FC<Props> = ({ addRead }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [books, setBooks] = useState<SearchBook[]>([])
  const [items, setItems] = useState<MenuProps['items']>([])
  const [query, setQuery] = useState<string>("")

  const onItemClick = (book: SearchBook) => {
    setDropdownOpen(false)
    setQuery("")
    addRead({
      title: book.title,
      author: book.author,
      rating: 0
    })
  };

  const onSearch = async (query: string) => {
    if (query === "") {
      return
    }
    try {
      const response = await fetch(`/api/search?q=${query}`)
      const data = await response.json()
      setBooks(data)
      setItems(booksToItems(data, onItemClick))
      setDropdownOpen(true)
    } catch (error) {
      console.error(error)
      setBooks([])
      setItems([])
      setDropdownOpen(false)
      setQuery("")
    }
  }

  return (
    <Dropdown
      menu={{ items }}
      open={dropdownOpen}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Search
          placeholder="Search books"
          allowClear
          enterButton="Search"
          onSearch={onSearch}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setBooks([])
            setItems([])
            setDropdownOpen(false)
          }}
        />
      </a>
    </Dropdown>
  )
}
