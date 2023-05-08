import React, { useState } from 'react'
import { DatePicker, Popover} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import StarRatingPicker from './StartRatingPicker'

interface StarRatingPopoverProps {
  title?: string
  onRatingChange?: (value: number, date: string) => void
  rootContent: React.ReactNode,
}

const StarRatingPopover: React.FC<StarRatingPopoverProps> = ({
  title = "What did you think?",
  onRatingChange,
  rootContent,
}) => {
  const [rating, setRating] = useState<number>(0)
  const [dateCompleted, setDateCompleted] = useState<string>(dayjs().format("YYYY-MM-DD"))

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    setDateCompleted(dateString)
  }


  const handleRatingChange = (value: number) => {
    setRating(value)
    if (onRatingChange) {
      onRatingChange(value, dateCompleted)
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
