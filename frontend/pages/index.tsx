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
  
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
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
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={messages.length > 0 ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-3.5-turbo')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              GPT-3.5
            </Flex>
            <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-4' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'gpt-4' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-4')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdBolt}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              GPT-4
            </Flex>
          </Flex>

          <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    No plugins added
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  textAlign={'center'}
                >
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
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
                    p="22px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="14px"
                    maxW="70%"
                    zIndex={'2'}
                    bg={useColorModeValue('blue.50', 'whiteAlpha.100')}
                  >
                    <Text
                      color={textColor}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight={{ base: '24px', md: '26px' }}
                    >
                      {message.content}
                    </Text>
                  </Flex>
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={'transparent'}
                    border="1px solid"
                    borderColor={borderColor}
                    ms="20px"
                    h="40px"
                    minH="40px"
                    minW="40px"
                  >
                    <Icon
                      as={MdPerson}
                      width="20px"
                      height="20px"
                      color={brandColor}
                    />
                  </Flex>
                </Flex>
              ) : (
                <Flex w="100%" justifyContent="flex-start">
                  <Flex
                    borderRadius="full"
                    justify="center"
                    align="center"
                    bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                    me="20px"
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
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            value={inputCode}
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
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
            borderRadius="45px"
            w="100%"
            h="54px"
            borderColor={brandColor}
            color={brandColor}
            _hover={{
              bg: useColorModeValue('gray.100', 'whiteAlpha.100'),
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
