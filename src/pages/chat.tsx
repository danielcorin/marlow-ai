import { OpenAI } from "langchain/llms"
import { BufferMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"

import { useState } from "react"
import { Button, Input } from "antd"

export default function ChatPage() {

  async function sendMessage(text: string) {
    const model = new OpenAI({})
    const memory = new BufferMemory()
    const chain = new ConversationChain({ llm: model, memory: memory })
    const res1 = await chain.call({ input: "Hi! I'm Jim." })
    console.log({ res1 })
  }

  const [inputValue, setInputValue] = useState<string>("")
  const [memory, setMemory] = useState<BufferMemory>(new BufferMemory())

  const handleInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed')
      // Add your logic here for what happens when Enter key is pressed
    }
  }

  const handleButtonClick = () => {
    console.log('Button clicked')
    // Add your logic here for what happens when button is clicked
  }

  return (
    <>
      <Input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onPressEnter={handleInputEnter}
      />
      <Button onClick={handleButtonClick}>Click me</Button>

      {memory.chatHistory.messages.map((message, i) => (
        <div key={i}>{message.text}</div>
      ))}
    </>
  )
}
