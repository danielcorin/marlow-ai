import React from 'react';
import { Table, Space } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { ReadBook } from '@/types/types';

interface Props {
  readList: Record<string, ReadBook>;
  removeRead: (book: ReadBook) => void;
  rowSelection: any;
}

const ReadTable: React.FC<Props> = ({
  readList,
  removeRead,
  rowSelection
}) => {
  const dataSource = readList ? Object.values(readList) : [];

  const columns: ColumnType<ReadBook>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author)
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating
    },
    {
      title: 'Date Completed',
      dataIndex: 'dateCompleted',
      key: 'dateCompleted',
      sorter: (a, b) => {
        if (!a.dateCompleted) {
          return -1;
        } else if (!b.dateCompleted) {
          return 1;
        }
        return new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime();
      }
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
      pagination={false}
      className="mb-8"
      rowSelection={rowSelection}
      rowKey="title"
      columns={columns}
      size="small"
    />
  );
};

export default ReadTable;
