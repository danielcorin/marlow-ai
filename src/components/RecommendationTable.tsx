import { Table, Space, Popover } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { Book, ReadBook } from '@/types/types'
import StarRatingPopover from './StarRatingPopover'

interface Props {
  recList?: { [key: string]: Book }
  removeRec: (record: Book) => void,
  addRead: (record: ReadBook) => void,
}

const RecommendationTable: React.FC<Props> = ({ recList, removeRec, addRead }) => {
  const dataSource = recList ? Object.values(recList) : []

  const titleSorter = (a: Book, b: Book) => {
    if (a.title < b.title) {
      return -1
    } else if (a.title > b.title) {
      return 1
    } else {
      return 0
    }
  }

  const authorSorter = (a: Book, b: Book) => {
    if (a.author < b.author) {
      return -1
    } else if (a.author > b.author) {
      return 1
    } else {
      return 0
    }
  }

  const columns: ColumnType<Book>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: titleSorter,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: authorSorter,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, record: Book) => (
        <Space size="middle">
          <Popover
            overlayStyle={{ width: '350px' }}
            content={record.explanation}
            title={`Why "${record.title}"?`}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            explain
          </Popover>
          <div
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            <StarRatingPopover
              rootContent={<>read</>}
              onRateChange={
                (rating: number, date: string) => {
                  removeRec(record)
                  const newReadBook: ReadBook = {
                    title: record.title,
                    author: record.author,
                    rating: rating,
                    dateCompleted: date,
                  }
                  addRead(newReadBook)
                }
              }
            />
          </div>
          <div
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => {
              removeRec(record)
            }}
          >
            remove
          </div>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-8"
        scroll={{ x: 650 }}
        rowKey="title"
        size="small"
      />
    </>
  )
}

export default RecommendationTable
