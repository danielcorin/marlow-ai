import { Book, ReadBook } from "@/types/types"

interface GenerateRecommendationsOptions {
  bookList: ReadBook[]
  numRecs: number
}

interface RecommendationClient {
  generateRecommendations(
    apiKey: string,
    options: GenerateRecommendationsOptions,
    callback: Function
  ): Promise<Book[]>
}


function formatReadBooks(bookList: ReadBook[]) {
  let output = ""
  for (const book of bookList) {
    output += `${book.title} - ${book.author}: ${book.rating}\n`
  }
  return output
}

function calculatePointScale(readBooks: ReadBook[]) {
  let maxRating = -Infinity
  for (const book of readBooks) {
    if (book.rating > maxRating) {
      maxRating = book.rating
    }
  }
  return maxRating
}

function generateRecommendationsPrompt(
  bookList: ReadBook[],
  numRecs: number,
  pointScale: number,
) {
  return `
You are LibrarianGPT, a recommendation system that strives to give good book recommendations.
Recommend ${numRecs} books that the I have not read that you think they would really enjoy based the books they've read and their ratings.
The ratings are on a ${pointScale} point scale when 1 is the worst, meaning I disliked the book and ${point} is the best, meaing I loved the book.
Explain why you made your recommendations in detail, including why I will like them in the context of books and genres I have already read.
Recommend books from any genres.
Recommend books from any time period.
Recommend unique books that are not often suggested.
Recommend books that are on the shorter side.
Recommend books that are on the longer side.
Do not suggest books already in the ratings list.
Ratings of "0" should be considered "not rated".
My book ratings:

${formatReadBooks(bookList)}

Format your recommendations as an array of JSON objects with keys for "title", "author" and "explanation".
For example:

[
  {
    "title": "The Overstory", "author": "Richard Powers", "explanation": "your explanation here"
  }
]

Your recommendations:
`
}

async function requestCompletion(apiKey: string, content: string) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: content }],
    temperature: 0.75
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
    const responseJSON = await response.json()
    console.log(responseJSON)
    const content = responseJSON["choices"][0]["message"]["content"]
    const recommendations = JSON.parse(content)
    const newRecs: Book[] = []
    for (const rec of recommendations) {
      const newRec: Book = {
        title: rec["title"],
        author: rec["author"],
        explanation: rec["explanation"],
        date_generated: new Date().toISOString().slice(0, 10),
      }
      newRecs.push(newRec)
    }
    return newRecs
  } catch (error) {
    console.error(error)
    return []
  }
}

export const recommendationClient: RecommendationClient = {
  generateRecommendations(apiKey: string, options: GenerateRecommendationsOptions): Promise<BookRecommendations[]> {
    return new Promise((resolve, reject) => {
      const pointScale: number = calculatePointScale(options.bookList)
      const content = generateRecommendationsPrompt(
        options.bookList,
        options.numRecs,
        pointScale,
      )

      requestCompletion(apiKey, content)
        .then((recommendations: Book[]) => {
          const recs = recommendations.map((rec) => {
            return {
              title: rec.title,
              author: rec.author,
              explanation: rec.explanation,
            }
          })
          resolve(recs)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
