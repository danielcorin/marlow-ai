import { AddBookForm } from "@/components/AddBookForm"
import { BookSearch } from "@/components/BookSearch"
import ConfirmationButton from "@/components/ConfirmationButton"
import { SiteMenu } from "@/components/SiteMenu"
import useLocalStorage from "@/hooks/useLocalStorage"
import useLocalStorageObject from "@/hooks/useLocalStorageObject"
import { Book, ReadBook } from "@/types/types"
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Popover } from 'antd'
import Meta from "antd/es/card/Meta"
import Head from "next/head"
import Link from 'next/link'
import { useState } from "react"


function formatReadBooks(bookList: ReadBook[]) {
  let output = ""
  for (const book of bookList) {
    output += `${book.title} - ${book.author}: ${book.rating}\n`
  }
  return output
}

function formatRecBooks(bookList: Book[]) {
  let output = ""
  for (const book of bookList) {
    output += `${book.title} - ${book.author}\n`
  }
  return output
}


function generateRecommendationsPrompt(
  bookList: ReadBook[], recList: Book[], num_recs: Number, point: Number,
) {
  return `
You are LibrarianGPT, an excellent recommendation system that strives to give good book recommendations.
Recommend ${num_recs} books that the I have not read that you think I would really enjoy based the books I've already read and ratings.
They higher the rating, the more I liked the book.
Recommend books from a diverse set of genres and time periods.
Occasionally, recommend unique books that are not often suggested.
Do not recommend books already in the the lists.
Ratings of "0" should be considered "not rated".
Explain why you made your recommendations in detail, including why you think I will like them in the context of books and genres I have already read.

You are LibrarianGPT, an excellent recommendation system that strives to give good book recommendations.
Recommend 5 books that the user has not read that you think they will enjoy based the books they're already read and ratings.
Recommend books from a diverse set of genres and time periods.
Occasionally, recommend unique books that are not often suggested.
Do not recommend books already in the the lists.
Ratings of "0" should be considered "not rated".
Explain why you made your recommendations in detail, including why the user would like them in the context of books and genres they have already read.

${formatRecBooks(recList)}

My book ratings:

${formatReadBooks(bookList)}

Your response should be JSON, adhering to the following schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string"
      },
      "author": {
        "type": "string"
      },
      "explanation": {
        "type": "string"
      }
    },
    "required": ["title", "author", "explanation"]
  }
}
`.replace(/\s\([^()]*\)/g, '') // remove series identifiers
}

const systemPrompt = `
You are LibrarianGPT, an excellent recommendation system that strives to give good book recommendations.
Recommend 5 books that the user has not read that you think they will enjoy based the books they're already read and ratings.
Recommend books from a diverse set of genres and time periods.
Occasionally, recommend unique books that are not often suggested.
Do not recommend books already in the the lists.
Ratings of "0" should be considered "not rated".
Explain why you made your recommendations in detail, including why the user would like them in the context of books and genres they have already read.
`

export default function RecsPage() {
  const [form] = Form.useForm()

  const recommendationsHook = useLocalStorageObject<Book>("recommendations_obj", [])
  const readHook = useLocalStorageObject<ReadBook>("read", [])
  const proposedHook = useLocalStorageObject<Book>("proposed", [])
  const removedHook = useLocalStorageObject<Book>("removed", [])

  const [apiToken, setApiToken] = useLocalStorage("token", "")

  function handleApiTokenInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setApiToken(event.target.value)
  }

  const [loadingRecs, setLoadingRecs] = useState<boolean>(false)

  function requestCompletion(apiKey: string, content: string) {
    setLoadingRecs(true)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content }
      ],
      temperature: 0.75
    }

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const content = data["choices"][0]["message"]["content"]
        const recommendations = JSON.parse(content)
        setLoadingRecs(false)
        const newProposedRecs: Book[] = []
        for (const rec of recommendations) {
          const newRec: Book = {
            title: rec["title"],
            author: rec["author"],
            explanation: rec["explanation"],
            date_generated: new Date().toISOString().slice(0, 10),
          }
          newProposedRecs.push(newRec)
        }
        proposedHook.addItems(newProposedRecs)
      })
      .catch(error => {
        setLoadingRecs(false)
        console.error(error)
      })
  }

  function pointScale(readBooks: ReadBook[]) {
    let maxRating = -Infinity
    for (const book of readBooks) {
      if (book.rating > maxRating) {
        maxRating = book.rating
      }
    }
    return maxRating
  }

  const apiContent = (
    <div>
      Go to <a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI</a> to get a secret API token for this app, then paste it in this field.
    </div>
  )

  const addBook = (book: Book) => {
    recommendationsHook.addItem(book)
    proposedHook.removeItem(book)
  }

  const removeBook = (book: Book) => {
    proposedHook.removeItem(book)
    removedHook.addItem(book)
  }

  const currentPage = "recs"

  return (
    <div className="min-h-screen font-sans">
      <SiteMenu currentPage={currentPage} />
      <Head>
        <title>{`${currentPage} - marlow.ai`}</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-8">
        {
          Object.values(readHook.items || []).length === 0 ?
            <div className="text-center text-l font-light mb-4 text-blue-500">
              Add books to your <Link className="text-m mb-8 font-light" href="/library">library</Link> before generating recommendations
            </div> : null
        }
        <Form
          form={form}
          layout="vertical"
        >
          <div className="flex items-center">
            <Input.Password
              placeholder="OPENAI_API_TOKEN"
              value={apiToken}
              className="w-90"
              style={{ paddingRight: "2.5rem" }}
              onChange={handleApiTokenInputChange}
            />
            <div className="text-gray-400 ml-2">
              <Popover overlayStyle={{ width: "350px" }}
                content={apiContent}
                title="OpenAI API Token"
                className="cursor-pointer"
              >
                <QuestionCircleOutlined />
              </Popover>
            </div>
          </div>
          <Form.Item className="flex flex-col items-center justify-center p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="primary"
                onClick={() => {
                  const list = Object.values(readHook.items)

                  if (list.length === 0) return
                  const prompt: string = generateRecommendationsPrompt(
                    list,
                    Object.values(recommendationsHook.items),
                    5,
                    pointScale(list),
                  )
                  console.log(prompt)
                  requestCompletion(apiToken, prompt)
                }}
                loading={loadingRecs}
              >
                Generate
              </Button>
              <ConfirmationButton
                initialText="Clear"
                confirmationText="Confirm"
                actionOnConfirm={proposedHook.clearItems}
              />
            </div>
          </Form.Item>
        </Form>

        {Object.values(proposedHook.items || []).map(book => {
          return (
            <Card
              className="my-6"
              bordered={true}
              key={book.title}
              hoverable={true}
              actions={[
                <PlusCircleOutlined key="add" onClick={() => addBook(book)} />,
                <MinusCircleOutlined key="remove" onClick={() => removeBook(book)} />,
              ]}
            >
              <Meta
                title={book.title}
                description={book.author}
              />
              <div className="flex justify-center mt-3">
                <div>
                  {book.explanation}
                </div>
                <div>&nbsp;</div>
              </div>
            </Card>
          )
        })}
        <BookSearch addRead={readHook.addItem}/>
        <AddBookForm addRead={readHook.addItem} />

      </div>
    </div>
  )
}
