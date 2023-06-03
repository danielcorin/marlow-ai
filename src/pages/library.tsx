import { AddBookForm } from "@/components/AddBookForm"
import { BookSearch } from "@/components/BookSearch"
import ConfirmationButton from "@/components/ConfirmationButton"
import ReadTable from "@/components/ReadTable"
import { SiteMenu } from "@/components/SiteMenu"
import useLocalStorageObject from "@/hooks/useLocalStorageObject"
import { GoodreadsCSVRow, ReadBook } from "@/types/types"
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import Head from "next/head"
import { parse } from 'papaparse'
import { useState } from "react"
import { CSVLink } from "react-csv"


export default function LibraryPage() {
  const readHook = useLocalStorageObject<ReadBook>("read", [])

  const [selectedReadBooks, setSelectedReadBooks] = useState<ReadBook[]>([])

  const testCSV = [
    {title: "Test Title", author: "Test Author"},
    {title: "Test Title Two", author: "Test Author Two", "My Rating": 3},
    {title: "Test Title Three", author: "Test Author Three", "My Rating": 2, "Date Read": "2022-02-12"},
  ]

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
      readHook.addItems(booksToAdd)
    }
    reader.readAsText(file)
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ReadBook[]) => {
      setSelectedReadBooks(selectedRows)
    },
  }
  const currentPage = "library"
  return (
    <div className="min-h-screen font-sans">
      <SiteMenu currentPage={currentPage} />
      <Head>
      <title>{`${currentPage} - marlow.ai`}</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-8">
      <div className="text-center text-l font-light mb-4 text-blue-500">
          Download your <a href="https://www.goodreads.com/review/import" target="_blank">Goodreads history</a> or a <CSVLink target="_blank" data={testCSV} filename={"my_books_template.csv"}>CSV template</CSVLink>
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
            <ConfirmationButton
              initialText="Clear"
              confirmationText="Confirm"
              actionOnConfirm={() => {
                if(selectedReadBooks.length !== 0) {
                  for (let book of selectedReadBooks) {
                    readHook.removeItem(book)
                    setSelectedReadBooks([])
                  }
                } else {
                  readHook.clearItems()
                }
              }}
            />
          </div>
        </div>

        <BookSearch addRead={readHook.addItem}/>
        <AddBookForm addRead={readHook.addItem} />

        <ReadTable
          readList={readHook.items}
          removeRead={readHook.removeItem}
          updateRead={readHook.updateItem}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  )
}
