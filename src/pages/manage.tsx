import { ReadListTable } from "@/components/addBookForm";
import ConfirmationButton from "@/components/confirmationButton";
import useLocalStorageObject from "@/hooks/useLocalStorageObject";
import { Book, GoodreadsCSVRow, ReadBook } from "@/types/types";
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, Space, Table, Upload } from 'antd';
import Head from "next/head";
import { parse } from 'papaparse';
import { useEffect, useState } from "react";


const { Column } = Table;

function formatReadBooks(bookList: ReadBook[]) {
  let output = "";
  for (const book of bookList) {
    output += `${book.title} - ${book.author}: ${book.rating}\n`;
  }
  return output
}

function generateRecommendationsPrompt(
  bookList: ReadBook[], num_recs: Number, point: Number,
) {
  return `
You are LibrarianGPT, a recommendation system that strives to give good book recommendations.
Recommend ${num_recs} books that the I have not read that you think they would really enjoy based the books they've read and their ratings.
The ratings are on a ${point} point scale when 1 is the worst, meaning I disliked the book and ${point} is the best, meaing I loved the book.
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

Format your recomendations as an array of JSON objects with keys for "title", "author" and "explanation".
For example:

[
  {
    "title": "The Overstory",
    "author": "Richard Powers",
    "explanation": "your explanation here"
  }
]

Your recommendations:
`
}

export default function ManagePage() {
  const [form] = Form.useForm();

  const [recList, setRecList, removeRec, addRec, addRecs, clearRecList] = useLocalStorageObject<Book>("recommendations_obj", [])
  const [readList, setReadList, removeRead, addRead, addReads, clearReadsList] = useLocalStorageObject<ReadBook>("read", [])

  const [apiToken, setApiToken] = useState<string>("")
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setApiToken(value);
  };

  const [loadingRecs, setLoadingRecs] = useState<boolean>(false)

  useEffect(() => {
    setApiToken("")
  }, [])

  function requestCompletion(apiKey: string, content: string) {
    setLoadingRecs(true)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: content }],
      temperature: 0.5
    };

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
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
      .catch(error => console.error(error))
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
    };
    reader.readAsText(file)
  };

  function pointScale(readBooks: ReadBook[]) {
    let maxRating = -Infinity;
    for (const book of readBooks) {
      if (book.rating > maxRating) {
        maxRating = book.rating;
      }
    }
    return maxRating;
  }

  const apiContent = (
    <div>
      Go to <a href="https://platform.openai.com/account/api-keys">OpenAI</a> to get a secret API token for this app, then paste it in this field.
    </div>
  );
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
          <div className="relative">
            <Input.Password
              placeholder="OPENAI_API_TOKEN"
              value={apiToken}
              className="pr-10"
              style={{ paddingRight: "2.5rem" }}
              onChange={handleInputChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center justify-center w-8">
              <Popover overlayStyle={{ width: "350px" }}
                content={apiContent}
                title="OpenAI API Token"
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                <QuestionCircleOutlined className="text-gray-500" />
              </Popover>
            </div>
          </div>
          <Form.Item className="flex flex-col items-center justify-center p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="primary"
                onClick={() => {
                  const list = Object.values(readList)
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
              <ConfirmationButton initialText="Clear" confirmationText="Confirm" actionOnConfirm={clearRecList}></ConfirmationButton>
            </div>
          </Form.Item>
        </Form>

        <Table
          dataSource={recList ? Object.values(recList) : []}
          pagination={false}
          className="mb-8"
          scroll={{ x: 650 }}
        >
          <Column title="Title" dataIndex="title" key="title"
            sorter={
              (a: Book, b: Book) => {
                if (a.title < b.title) {
                  return -1;
                } else if (a.title > b.title) {
                  return 1;
                } else {
                  return 0;
                }
              }
            } />
          <Column title="Author" dataIndex="author" key="author"
            sorter={
              (a: ReadBook, b: ReadBook) => {
                if (a.author < b.author) {
                  return -1;
                } else if (a.author > b.author) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }
          />
          <Column title="Action" dataIndex="action" key="action" fixed="right"
            render={(_, record: Book) => (
              <Space size="middle">
                <Popover overlayStyle={{ width: "350px" }} content={record.explanation} title={`Why "${record.title}"?`}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  explain
                </Popover>
                <div
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={
                    () => {
                      removeRec(record)
                    }
                  }
                >
                  read
                </div>
                <div
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={
                    () => {
                      removeRec(record)
                    }
                  }
                >
                  remove
                </div>
              </Space>
            )}
          />
        </Table>

        <h1 className="text-center text-2xl font-light mb-4">Read Books 📚</h1>


        <div className="flex flex-col items-center justify-center p-3">
          <div className="grid grid-cols-2 gap-2">
            <Upload
              accept=".csv"
              showUploadList={false}
              beforeUpload={handleFile}
            >
              <Button type="primary" icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
            <ConfirmationButton initialText="Clear" confirmationText="Confirm" actionOnConfirm={clearReadsList}></ConfirmationButton>
          </div>
        </div>

        <ReadListTable addRead={addRead} />

        <Table
          dataSource={readList ? Object.values(readList) : []}
          pagination={false}
          className="mb-8"
        >
          <Column title="Title" dataIndex="title" key="title"
            sorter={
              (a: ReadBook, b: ReadBook) => {
                if (a.title < b.title) {
                  return -1;
                } else if (a.title > b.title) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }
          />
          <Column title="Author" dataIndex="author" key="author"
            sorter={
              (a: ReadBook, b: ReadBook) => {
                if (a.author < b.author) {
                  return -1;
                } else if (a.author > b.author) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }
          />
          <Column title="Rating" dataIndex="rating" key="rating"
            sorter={
              (a: ReadBook, b: ReadBook) => a.rating - b.rating
            }
          />
          <Column title="Date Completed" dataIndex="dateCompleted" key="dateCompleted"
            sorter={
              (a: ReadBook, b: ReadBook) => {
                if (a.dateCompleted === undefined) {
                  return -1
                } else if (b.dateCompleted === undefined) {
                  return 1
                }
                return (
                  new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime()
                )
              }
            }
          />
          <Column title="Action" dataIndex="action" key="action"
            render={(_, record: ReadBook) => (
              <Space size="middle">
                <div
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={
                    () => removeRead(record)
                  }
                >
                  remove
                </div>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
