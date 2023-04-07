import React, { useState } from 'react'
import { DatePicker, Input, Popover, Rate } from 'antd'
import { StarFilled } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

interface StarRatingPickerProps {
  value?: number
  onChange?: (value: number) => void
}

const StarRatingPicker: React.FC<StarRatingPickerProps> = ({ value = 0, onChange }) => {
  return (
    <Rate
      character={<StarFilled />}
      value={value}
      onChange={onChange}
      tooltips={["Didn't like it", "It was ok", "Liked it", "Really like it", "It was amazing"]}
    />
  )
}

interface StarRatingPopoverProps {
  title?: string
  onRateChange?: (value: number, date: string) => void
  rootContent: React.ReactNode,
}

const StarRatingPopover: React.FC<StarRatingPopoverProps> = ({
  title = "What did you think?",
  onRateChange,
  rootContent,
}) => {
  const [rating, setRating] = useState<number>(0)
  const [dateCompleted, setDateCompleted] = useState<string>(dayjs().format("YYYY-MM-DD"))

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    console.log(date)
    console.log(dateString)
    setDateCompleted(dateString)
  }


  const handleRatingChange = (value: number) => {
    setRating(value)
    if (onRateChange) {
      onRateChange(value, dateCompleted)
    }
  }

  const content = (
    <div className="flex flex-col">
      <DatePicker value={dayjs(dateCompleted || "")} format={"YYYY-MM-DD"} onChange={handleDateChange} />
      <StarRatingPicker
        value={rating}
        onChange={handleRatingChange}
      />
    </div>
  )

  return (
    <Popover content={content} title={title} trigger="click">
      <div style={{ cursor: 'pointer' }}>
        {rootContent}
      </div>
    </Popover>
  )
}

export default StarRatingPopover
