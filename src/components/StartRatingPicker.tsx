import { StarFilled } from "@ant-design/icons"
import { Rate } from "antd"

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

export default StarRatingPicker
