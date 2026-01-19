import ReactMarkdown from 'react-markdown'
import { useColorModeValue } from '@chakra-ui/react'
import Card from '@/components/card/Card'

export default function MessageBox(props: { output: string }) {
  const { output } = props
  const textColor = useColorModeValue('#333333', 'white')
  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="20px !important"
      pl="20px !important"
      color={textColor}
      minH="auto"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '22px', md: '24px' }}
      fontWeight="400"
      bg={useColorModeValue('#F4F4F4', '#2A2A2A')}
      border="none"
    >
      <ReactMarkdown className="font-medium">
        {output ? output : ''}
      </ReactMarkdown>
    </Card>
  )
}
