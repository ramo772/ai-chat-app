'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import VodafoneLogo from '@/components/VodafoneLogo';
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
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdHelp, MdLightbulb, MdSupport, MdChat } from 'react-icons/md';
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
      minH="100vh"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '85vh', '2xl': '90vh' }}
        maxW="900px"
        px={{ base: '20px', md: '32px' }}
        py={{ base: '20px', md: '40px' }}
      >
        {/* Professional Corporate Hero Section */}
        {messages.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            flex="1"
            textAlign="center"
            py="80px"
          >
            {/* Vodafone Logo */}
            <Box mb="48px">
              <Image
                src="/img/vf-logo-large.png"
                alt="Vodafone"
                h={{ base: '60px', md: '80px' }}
                objectFit="contain"
              />
            </Box>
            
            {/* Simple Corporate Headline */}
            <Text
              fontSize={{ base: '32px', md: '48px' }}
              fontWeight="600"
              color={useColorModeValue('#333333', 'white')}
              mb="20px"
              letterSpacing="-0.5px"
              lineHeight="1.2"
            >
              How can we help you today?
            </Text>
            
            {/* Clean Description */}
            <Text
              fontSize={{ base: '16px', md: '18px' }}
              color={useColorModeValue('#666666', '#999999')}
              maxW="600px"
              lineHeight="1.6"
              fontWeight="400"
            >
              Get instant support from our AI assistant.
              Simply type your question below.
            </Text>
          </Flex>
        )}
        
        {/* Conversation History */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={messages.length > 0 ? 'flex' : 'none'}
          mb={'auto'}
          mt={{ base: '24px', md: '40px' }}
        >
          {messages.map((message, index) => (
            <Flex key={index} direction="column" w="100%" mb="24px">
              {message.role === 'user' ? (
                <Flex w="100%" align="flex-start" justifyContent="flex-end">
                  <Flex
                    p="16px 20px"
                    borderRadius="8px"
                    maxW="75%"
                    bg={useColorModeValue('#E60000', '#CC0000')}
                  >
                    <Text
                      color="white"
                      fontWeight="400"
                      fontSize="15px"
                      lineHeight="24px"
                    >
                      {message.content}
                    </Text>
                  </Flex>
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={useColorModeValue('#666666', '#4A4A4A')}
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
                <Flex w="100%" justifyContent="flex-start" align="flex-start">
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
                  <Box maxW="75%">
                    <MessageBoxChat output={message.content} />
                  </Box>
                </Flex>
              )}
            </Flex>
          ))}
        </Flex>
        {/* Chat Input Section */}
        <Box
          mt="auto"
          pt="24px"
          borderTop="1px solid"
          borderColor={useColorModeValue('#E6E6E6', '#333333')}
          bg={useColorModeValue('white', '#1A1A1A')}
        >
          <Flex w="100%" mb="16px">
            <Input
              minH="56px"
              h="100%"
              border="2px solid"
              borderColor={borderColor}
              borderRadius="8px"
              p="16px 20px"
              me="12px"
              fontSize="15px"
              fontWeight="400"
              bg={useColorModeValue('white', '#1A1A1A')}
              _focus={{ 
                borderColor: '#E60000',
                boxShadow: 'none',
              }}
              _hover={{ borderColor: '#999999' }}
              color={inputColor}
              _placeholder={{ color: '#999999' }}
              placeholder="Type your message..."
              value={inputCode}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading && inputCode.trim()) {
                  handleTranslate();
                }
              }}
            />
            <Button
              variant="primary"
              px="32px"
              fontSize="15px"
              fontWeight="600"
              borderRadius="8px"
              w="120px"
              h="56px"
              onClick={handleTranslate}
              isLoading={loading ? true : false}
              isDisabled={!inputCode.trim() || loading}
            >
              Send
            </Button>
          </Flex>
        </Box>

        {/* End Conversation Button */}
        <Flex
          mt="12px"
          justifySelf={'flex-end'}
          display={messages.length > 0 ? 'flex' : 'none'}
        >
          <Button
            variant="outline"
            py="18px"
            px="24px"
            fontSize="14px"
            fontWeight="600"
            borderRadius="8px"
            w="100%"
            h="52px"
            borderWidth="2px"
            borderColor={brandColor}
            color={brandColor}
            bg="transparent"
            _hover={{
              bg: useColorModeValue('#FFE5E5', 'rgba(230, 0, 0, 0.1)'),
              borderColor: '#CC0000',
            }}
            _active={{
              bg: useColorModeValue('#FFB3B3', 'rgba(230, 0, 0, 0.2)'),
            }}
            onClick={handleEndConversation}
            isLoading={isEndingConversation}
          >
            End Conversation & Download Summary
          </Button>
        </Flex>

        {/* Professional Footer */}
        <Flex
          justify="center"
          mt="32px"
          pt="24px"
          borderTop={messages.length > 0 ? '1px solid' : 'none'}
          borderColor={useColorModeValue('#E6E6E6', '#333333')}
          direction="column"
          alignItems="center"
          gap="8px"
        >
          <Text 
            fontSize="13px" 
            textAlign="center" 
            color={useColorModeValue('#999999', '#666666')}
          >
            AI-generated responses may not always be accurate. Please verify important information.
          </Text>
          <Flex
            gap="8px"
            alignItems="center"
          >
            <Text fontSize="12px" color={useColorModeValue('#999999', '#666666')}>
              © {new Date().getFullYear()} Vodafone
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
