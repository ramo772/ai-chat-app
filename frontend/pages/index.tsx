'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';

export default function Chat(props: { apiKeyApp: string }) {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  console.log('API Key from App:', props.apiKeyApp);
  const { apiKeyApp } = props;
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Messages array for conversation history
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [isEndingConversation, setIsEndingConversation] = useState<boolean>(false);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  
  // Connect to SSE for streaming responses
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/api/messages');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chunk' && data.content) {
          // Update the last message (assistant's response) with new content
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            // Only update if the last message is from assistant
            if (lastMessage.role === 'assistant') {
              newMessages[newMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + data.content,
              };
            }
            return newMessages;
          });
        } else if (data.type === 'done') {
          console.log('Stream completed');
        } else if (data.type === 'error') {
          console.error('Stream error:', data.content);
        } else if (data.type === 'connected') {
          console.log('Connected to SSE:', data.message);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };
    
    return () => {
      eventSource.close();
    };
  }, []);
  
  const borderColor = useColorModeValue('#E6E6E6', 'whiteAlpha.200');
  const inputColor = useColorModeValue('#333333', 'white');
  const iconColor = useColorModeValue('#E60000', 'white');
  const bgIcon = useColorModeValue(
    '#FFE5E5',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('#E60000', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('#666666', '#CCCCCC');
  const buttonShadow = useColorModeValue(
    '0 2px 12px rgba(0, 0, 0, 0.08)',
    'none',
  );
  const textColor = useColorModeValue('#333333', 'white');
  const placeholderColor = useColorModeValue(
    { color: '#999999' },
    { color: 'whiteAlpha.600' },
  );



  const handleTranslate = async () => {
    const apiKey = apiKeyApp;
    setInputOnSubmit(inputCode);

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 700 : 700;

    // if (!apiKeyApp?.includes('sk-') && !apiKey?.includes('sk-')) {
    //   alert('Please enter an API key.');
    //   return;
    // }

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: inputCode };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input field
    setInputCode('');
    
    setLoading(true);

    // Add empty assistant message that will be updated
    setMessages((prev) => [...prev, { role: 'assistant' as const, content: '' }]);
    
    try {
      // Call backend API
      const response = await fetch('http://localhost:8000/api/chatAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputCode,
          message: inputCode
        }),
      });

      if (!response.ok) {
        setLoading(false);
        alert('Something went wrong with the API request.');
        // Remove the empty assistant message on error
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('Failed to connect to the backend.');
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    }
  };
  
  // Handle end conversation - generate summary/PDF
  const handleEndConversation = async () => {
    if (messages.length === 0) {
      alert('No conversation to summarize.');
      return;
    }

    setIsEndingConversation(true);

    try {
      const response = await fetch('http://localhost:8000/api/end-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate conversation summary');
      }

      // Get the file blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversation-summary-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Conversation summary downloaded successfully!');
    } catch (error) {
      console.error('Error ending conversation:', error);
      alert('Failed to generate conversation summary. Please try again.');
    } finally {
      setIsEndingConversation(false);
    }
  };
  
  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
      bg={useColorModeValue('#FFFFFF', '#1A1A1A')}
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
        px={{ base: '20px', md: '40px' }}
      >
        {/* Welcome Message - Show when no messages */}
        {messages.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            flex="1"
            textAlign="center"
            mb="40px"
          >
            <Text
              fontSize={{ base: '32px', md: '48px' }}
              fontWeight="700"
              color={useColorModeValue('#E60000', 'white')}
              mb="16px"
            >
              Hello, how can I help?
            </Text>
            <Text
              fontSize={{ base: '16px', md: '18px' }}
              color={useColorModeValue('#666666', '#CCCCCC')}
              maxW="600px"
            >
              Ask me anything. I'm here to assist you with your questions.
            </Text>
          </Flex>
        )}
        
        {/* Main Box - Conversation History */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={messages.length > 0 ? 'flex' : 'none'}
          mb={'auto'}
        >
          {messages.map((message, index) => (
            <Flex key={index} direction="column" w="100%" mb="20px">
              {message.role === 'user' ? (
                <Flex w="100%" align={'center'} mb="10px" justifyContent="flex-end">
                  <Flex
                    p="16px 20px"
                    border="none"
                    borderRadius="8px"
                    maxW="70%"
                    zIndex={'2'}
                    bg={useColorModeValue('#FFE5E5', '#660000')}
                  >
                    <Text
                      color={useColorModeValue('#333333', 'white')}
                      fontWeight="500"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '22px', md: '24px' }}
                    >
                      {message.content}
                    </Text>
                  </Flex>
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={useColorModeValue('#E60000', '#CC0000')}
                    ms="12px"
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdPerson}
                      width="20px"
                      height="20px"
                      color="white"
                    />
                  </Flex>
                </Flex>
              ) : (
                <Flex w="100%" justifyContent="flex-start">
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={useColorModeValue('#E60000', '#CC0000')}
                    me="12px"
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdAutoAwesome}
                      width="20px"
                      height="20px"
                      color="white"
                    />
                  </Flex>
                  <Box maxW="70%">
                    <MessageBoxChat output={message.content} />
                  </Box>
                </Flex>
              )}
            </Flex>
          ))}
        </Flex>
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="2px solid"
            borderColor={borderColor}
            borderRadius="8px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="400"
            _focus={{ borderColor: '#E60000', boxShadow: '0 0 0 1px #E60000' }}
            _hover={{ borderColor: '#999999' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            value={inputCode}
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="24px"
            fontSize="sm"
            fontWeight="600"
            borderRadius="8px"
            ms="auto"
            w={{ base: '140px', md: '180px' }}
            h="54px"
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>

        {/* End Conversation Button */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="10px"
          justifySelf={'flex-end'}
          display={messages.length > 0 ? 'flex' : 'none'}
        >
          <Button
            variant="outline"
            py="20px"
            px="16px"
            fontSize="sm"
            fontWeight="600"
            borderRadius="8px"
            w="100%"
            h="54px"
            borderWidth="2px"
            borderColor={brandColor}
            color={brandColor}
            _hover={{
              bg: useColorModeValue('#FFE5E5', 'whiteAlpha.100'),
            }}
            onClick={handleEndConversation}
            isLoading={isEndingConversation}
          >
            End Conversation & Download Summary
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts.
          </Text>
          <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              ChatGPT May 12 Version
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
