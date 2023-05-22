import { BookOutlined, ExperimentOutlined, CheckSquareOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Menu } from "antd"
import Link from "next/link";


type Props = {
  currentPage: string
}

const items: MenuProps["items"] = [
  {
    label: (
      <Link href="/">
        marlow.ai
      </Link>
    ),
    key: "/",
  },
  {
    label: (
      <Link href="/library">
        Library
      </Link>
    ),
    key: "library",
    icon: <BookOutlined />,
  },
  {
    label: (
      <Link href="/recs">
        Recs
      </Link>
    ),
    key: "recs",
    icon: <ExperimentOutlined />,
  },
  {
    label: (
      <Link href="/pile">
        Pile
      </Link>
    ),
    key: "pile",
    icon: <CheckSquareOutlined />,
  },
];



export const SiteMenu: React.FC<Props> = ({ currentPage }) => {
  return <Menu
    selectedKeys={[currentPage]}
    mode="horizontal"
    items={items}
  />
}
