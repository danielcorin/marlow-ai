import { AddBookForm } from "@/components/AddBookForm"
import { BookSearch } from "@/components/BookSearch"
import ConfirmationButton from "@/components/ConfirmationButton"
import ReadTable from "@/components/ReadTable"
import RecommendationTable from "@/components/RecommendationTable"
import useLocalStorage from "@/hooks/useLocalStorage"
import useLocalStorageObject from "@/hooks/useLocalStorageObject"
import { Book, GoodreadsCSVRow, ReadBook } from "@/types/types"
import { QuestionCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Popover, Upload } from 'antd'
import Head from "next/head"
import { parse } from 'papaparse'
import { useState } from "react"
import { CSVLink } from "react-csv";

function booksToCSVData(books: Book[]) {
  return books.map(({ title, author, explanation, date_generated }) => ({
    title,
    author,
    explanation,
    date_generated,
  }));
}

function formatReadBooks(bookList: ReadBook[]) {
  let output = ""
  for (const book of bookList) {
    output += `${book.title} - ${book.author}: ${book.rating}\n`
  }
  return output
}

function generateRecommendationsPrompt(
  bookList: ReadBook[], num_recs: Number, point: Number,
) {
  return `
You are LibrarianGPT, an excellent recommendation system that strives to give good book recommendations.
Recommend ${num_recs} books that the I have not read that you think I would really enjoy based the books I've already read and ratings.
They higher the rating, the more I liked the book.
Recommend books from a diverse set of genres and time periods.
Occasionally, recommend unique books that are not often suggested.
Do not recommend books already in the ratings list.
Ratings of "0" should be considered "not rated".
Explain why you made your recommendations in detail, including why you think I will like them in the context of books and genres I have already read.

My book ratings:

${formatReadBooks(bookList)}

Format your recomendations as an array of JSON objects like the following example:

[
  {
    "title": "The Overstory", "author": "Richard Powers", "explanation": "your explanation here"
  }
]

Your recommendations:
`
}

export default function ManagePage() {
  const [form] = Form.useForm()

  const [
    recList, setRecList, removeRec, addRec, addRecs, updateRec, clearRecList,
  ] = useLocalStorageObject<Book>("recommendations_obj", [])
  const [
    readList, setReadList, removeRead, addRead, addReads, updateRead, clearReadsList,
  ] = useLocalStorageObject<ReadBook>("read", [])

  const [selectedReadBooks, setSelectedReadBooks] = useState<ReadBook[]>([])

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
      messages: [{ role: 'user', content: content }],
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
        addRecs(newRecs)
      })
      .catch(error => {
        setLoadingRecs(false)
        console.error(error)
      })
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const csv = parse<GoodreadsCSVRow>(reader.result as string, { header: true })

      const booksToAdd: ReadBook[] = []
      for (const row of csv.data) {
        if (row["Exclusive Shelf"] === "read") {
          const completed: (string | undefined) = row["Date Read"] === "" ? undefined : row["Date Read"].replaceAll("/", "-")
          booksToAdd.push({
            title: row["Title"],
            author: row["Author"],
            rating: parseInt(row["My Rating"], 10),
            dateCompleted: completed,
          })
        }
      }
      addReads(booksToAdd)
    }
    reader.readAsText(file)
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ReadBook[]) => {
      setSelectedReadBooks(selectedRows)
    },
  }

  return (
    <div className="min-h-screen font-sans">

      <Head>
        <title>book recs - marlow.ai</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-8 text-center">marlow.ai ✨</h1>
        <h1 className="text-center text-2xl font-light mb-4">Recommendations 🤖</h1>
        {
          Object.values(readList || []).length === 0 ?
            <div className="text-center text-l font-light mb-4 text-blue-500">
              Add books you&apos;ve read below before you generate recommendations
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
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="primary"
                onClick={() => {
                  const list = Object.values(
                    selectedReadBooks.length !== 0 ? selectedReadBooks : readList
                  )

                  if (list.length === 0) return
                  const prompt: string = generateRecommendationsPrompt(
                    list,
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
              <Button type="primary" icon={<DownloadOutlined />}>
              <CSVLink data={booksToCSVData(Object.values(recList || {}))} filename={"recommendations.csv"}>
                Download
              </CSVLink>
              </Button>
              <ConfirmationButton
                initialText="Clear"
                confirmationText="Confirm"
                actionOnConfirm={clearRecList}
              />
            </div>
          </Form.Item>
        </Form>

        <RecommendationTable
          recList={recList}
          removeRec={removeRec}
          addRead={addRead}
        />

        <h1 className="text-center text-2xl font-light mb-4">Read Books 📚</h1>
        <div className="text-center text-l font-light mb-4 text-blue-500">
          Download your Goodreads history <a href="https://www.goodreads.com/review/import" target="_blank">here</a>
        </div>

        <div className="flex flex-col items-center justify-center p-3">
          <div className="grid grid-cols-2 gap-2">
            <Upload
              accept=".csv"
              showUploadList={false}
              beforeUpload={handleFile}
            >
              <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <ConfirmationButton initialText="Clear" confirmationText="Confirm" actionOnConfirm={clearReadsList}></ConfirmationButton>
          </div>
        </div>

        <BookSearch addRead={addRead}/>
        <AddBookForm addRead={addRead} />

        <ReadTable readList={readList} removeRead={removeRead} rowSelection={rowSelection} />
      </div>
    </div>
  )
}
