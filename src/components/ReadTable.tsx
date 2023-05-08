import React, { useState } from 'react';
import { Table, Space, Popover } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { ReadBook } from '@/types/types';
import StarRatingPicker from './StartRatingPicker';

interface Props {
  readList: Record<string, ReadBook>;
  removeRead: (book: ReadBook) => void;
  updateRead: (book: ReadBook) => void,
  rowSelection: any;
}

const ReadTable: React.FC<Props> = ({
  readList,
  removeRead,
  updateRead,
  rowSelection,
}) => {
  const dataSource = readList ? Object.values(readList) : [];

  const ratingPopoverContent = (value: number, onChange: ((value: number) => void)) => (
    <StarRatingPicker
      value={value}
      onChange={onChange}
    />
  )
  const columns: ColumnType<ReadBook>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: (text: string, record: any) => (
        <Popover
          content={
            ratingPopoverContent(record.rating, (rating: number) => {
              const updatedReadBook: ReadBook = {
                title: record.title,
                author: record.author,
                rating: rating,
                dateCompleted: record.date,
              }
              updateRead(updatedReadBook)
            })
          }
          title='Change rating'
          trigger="hover"
        >
          {record.rating}
        </Popover>
      )
    },
    {
      title: 'Completed',
      dataIndex: 'dateCompleted',
      key: 'dateCompleted',
      sorter: (a, b) => {
        if (!a.dateCompleted) {
          return -1;
        } else if (!b.dateCompleted) {
          return 1;
        }
        return new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime();
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record: ReadBook) => (
        <Space size="middle">
          <div
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => removeRead(record)}
          >
            remove
          </div>
        </Space>
      )
    }
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      className="mb-8"
      rowSelection={rowSelection}
      rowKey="title"
      size="small"
    />
  );
};

export default ReadTable;
