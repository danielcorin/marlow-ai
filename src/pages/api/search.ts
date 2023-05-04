import { SearchBook } from '@/types/types';
import type { NextApiRequest, NextApiResponse } from 'next'

async function searchBooks(query: string): Promise<SearchBook[]> {
  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const books = data.items.map((item: { id: any; volumeInfo: { title: any; authors: any[]; imageLinks: { smallThumbnail: any } } }) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors[0],
    }));
    return books;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchBook[]>
) {
  const query = req.query.q as string;
  const books = await searchBooks(query);
  res.status(200).json(books);
}
