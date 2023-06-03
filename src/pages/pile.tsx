import ConfirmationButton from "@/components/ConfirmationButton"
import RecommendationTable from "@/components/RecommendationTable"
import { SiteMenu } from "@/components/SiteMenu"
import useLocalStorageObject from "@/hooks/useLocalStorageObject"
import { Book, ReadBook } from "@/types/types"
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import Head from "next/head"
import { CSVLink } from "react-csv"

function booksToCSVData(books: Book[]) {
  return books.map(({ title, author, explanation, date_generated }) => ({
    title,
    author,
    explanation,
    date_generated,
  }));
}

export default function PilePage() {
  const [form] = Form.useForm()

  const recHook = useLocalStorageObject<Book>("recommendations_obj", [])
  const readHook = useLocalStorageObject<ReadBook>("read", [])

  const currentPage = "pile"

  return (
    <div className="min-h-screen font-sans">
      <SiteMenu currentPage={currentPage} />
      <Head>
        <title>{`${currentPage} - marlow.ai`}</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-8">
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item className="flex flex-col items-center justify-center p-3">
            <div className="grid grid-cols-2 gap-2">
              {Object.values(recHook.items || {}).length !== 0 ?
                <Button type="primary" icon={<DownloadOutlined />}>
                  <CSVLink data={booksToCSVData(Object.values(recHook.items || {}))} filename={"recommendations.csv"}>
                    Download
                  </CSVLink>
                </Button> : null
              }
              <ConfirmationButton
                initialText="Clear"
                confirmationText="Confirm"
                actionOnConfirm={recHook.clearItems}
              />
            </div>
          </Form.Item>
        </Form>

        <RecommendationTable
          recList={recHook.items}
          removeRec={recHook.removeItem}
          addRead={readHook.addItem}
        />

      </div>
    </div>
  )
}
