import { useState } from 'react'
import { ReadBook } from '@/types/types'
import { Form, Input, Button } from 'antd'

type Props = {
  addRead: (record: ReadBook) => void
}

export const AddBookForm: React.FC<Props> = ({ addRead }) => {
  const [form] = Form.useForm()
  const [newBook, setNewBook] = useState<ReadBook>({
    title: '',
    author: '',
    rating: 0,
    dateCompleted: undefined,
  })

  const handleFormSubmit = (values: ReadBook) => {
    // Call a function to add the new book to the table
    addRead(values)
    console.log("handleFormSubmit")
    // Then reset the form
    form.resetFields()
    setNewBook({
      title: '',
      author: '',
      rating: 0,
      dateCompleted: undefined,
    })
    console.log(newBook);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }))
  }

  return (
    <Form form={form} onFinish={handleFormSubmit} layout="inline">
      <Form.Item name="title" label="" rules={[{ required: true, message: 'Please input the title!' }]} style={{ display: 'inline-block' }}>
        <Input placeholder="Title" value={newBook.title} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item name="author" label="" rules={[{ required: true, message: 'Please input the author!' }]} style={{ display: 'inline-block' }}>
        <Input placeholder="Author" value={newBook.author} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item name="rating" label="" rules={[{ required: true, message: 'Please input the rating!' }]} style={{ display: 'inline-block' }}>
        <Input type="number" placeholder="Rating" value={newBook.rating} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item name="dateCompleted" label="" style={{ display: 'inline-block' }}>
        <Input type="date" placeholder="Date Completed" value={newBook.dateCompleted || ''} onChange={handleInputChange} />
      </Form.Item>
      <Form.Item style={{ display: 'inline-block' }}>
        <Button htmlType="submit">+</Button>
      </Form.Item>
    </Form>
  )
}
