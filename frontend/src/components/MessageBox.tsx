import ReactMarkdown from 'react-markdown'
import { useColorModeValue } from '@chakra-ui/react'
import Card from '@/components/card/Card'

export default function MessageBox(props: { output: string }) {
  const { output } = props
  const textColor = useColorModeValue('#333333', 'white')
  const cardBg = useColorModeValue('#F4F4F4', '#2A2A2A')
  
  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="24px !important"
      py="18px !important"
      color={textColor}
      minH="auto"
      fontSize={{ base: '15px', md: '16px' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="400"
      bg={cardBg}
      border="none"
      borderRadius="12px"
      boxShadow={useColorModeValue('0 2px 8px rgba(0, 0, 0, 0.06)', 'none')}
    >
      <ReactMarkdown 
        className="font-medium"
        components={{
          p: ({ node, ...props }) => <p style={{ marginBottom: '12px' }} {...props} />,
          strong: ({ node, ...props }) => <strong style={{ fontWeight: 600, color: useColorModeValue('#E60000', '#FF4D4D') }} {...props} />,
          a: ({ node, ...props }) => <a style={{ color: '#E60000', textDecoration: 'underline' }} {...props} />,
        }}
      >
        {output ? output : ''}
      </ReactMarkdown>
    </Card>
  )
}
