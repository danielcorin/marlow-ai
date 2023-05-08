import { ReadBook } from '@/types/types'
import { StarFilled } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Rate } from 'antd'
import dayjs, { Dayjs } from "dayjs"
import { useState } from 'react'

type Props = {
  addRead: (record: ReadBook) => void
}

const dateFormat = "YYYY-MM-DD"

export const AddBookForm: React.FC<Props> = ({ addRead }) => {
  const [form] = Form.useForm()
  const [newBook, setNewBook] = useState<ReadBook>({
    title: '',
    author: '',
    rating: 0,
    dateCompleted: undefined,
  })

  const handleFormSubmit = () => {
    // Call a function to add the new book to the table
    addRead(newBook)
    // Then reset the form
    form.resetFields()
    setNewBook({
      title: '',
      author: '',
      rating: 0,
      dateCompleted: undefined,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }))
  }

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    const completed = date?.format(dateFormat)
    setNewBook((prevBook) => ({ ...prevBook, ["dateCompleted"]: completed }))
  }

  const handleRatingChange = (n: number) => {
    setNewBook((prevBook) => ({ ...prevBook, ["rating"]: n }))
  }

  return (
    <Form form={form} onFinish={() => handleFormSubmit()} layout="inline">
      <Form.Item name="title" label="" rules={[{ required: true, message: 'Please input the title!' }]} style={{ display: 'inline-block' }}>
        <Input placeholder="Title" name="title" value={newBook.title} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item name="author" label="" rules={[{ required: true, message: 'Please input the author!' }]} style={{ display: 'inline-block' }}>
        <Input placeholder="Author" name="author" value={newBook.author} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item name="rating" label="" rules={[{ required: false, message: 'Please input the rating!' }]} style={{ display: 'inline-block' }}>
        <Rate
          character={<StarFilled />}
          value={newBook.rating}
          onChange={handleRatingChange}
          tooltips={["Didn't like it", "It was ok", "Liked it", "Really like it", "It was amazing"]}
        />
      </Form.Item>
      <Form.Item name="dateCompleted" label="" style={{ display: 'inline-block' }}>
        <DatePicker format={dateFormat} value={dayjs(newBook.dateCompleted)} onChange={handleDateChange} placeholder="Completed on"/>
      </Form.Item>
      <Form.Item style={{ display: 'inline-block' }}>
        <Button htmlType="submit">+</Button>
      </Form.Item>
    </Form>
  )
}
