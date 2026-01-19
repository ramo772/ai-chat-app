'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { MdUpload, MdRefresh, MdLink } from 'react-icons/md';
import { MarkdownBlock } from '@/components/MarkdownBlock';

export default function PRReview() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<'review' | 'description' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('brand.500', 'brand.400');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (200KB limit)
      if (file.size > 200 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 200KB',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setSelectedFile(file);
      setReview(''); // Clear previous review
      setDescription(''); // Clear previous description
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a diff file to upload',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setReview('');
    setActiveAction('review');

    try {
      const formData = new FormData();
      formData.append('diff', selectedFile);

      const response = await fetch('http://localhost:3000/review', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reviewText = await response.text();
      setReview(reviewText);

      toast({
        title: 'Review completed',
        description: 'PR review has been generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleGenerateDescription = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a diff file to upload',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setDescription('');
    setActiveAction('description');

    try {
      const formData = new FormData();
      formData.append('diff', selectedFile);

      const response = await fetch('http://localhost:3000/generate-description', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const descriptionText = await response.text();
      setDescription(descriptionText);

      toast({
        title: 'Description generated',
        description: 'PR description has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate description',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleUploadGithubUrl = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: 'No URL provided',
        description: 'Please enter a GitHub PR URL',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setReview('');

    try {
      const response = await fetch('http://localhost:3000/review-github-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prUrl: githubUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const reviewText = await response.text();
      setReview(reviewText);

      toast({
        title: 'Review completed',
        description: 'PR review has been generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching GitHub PR:', error);
      toast({
        title: 'Review failed',
        description: error instanceof Error ? error.message : 'Failed to review GitHub PR',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleGenerateDescriptionGithub = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: 'No URL provided',
        description: 'Please enter a GitHub PR URL',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setDescription('');
    setActiveAction('description');

    try {
      const response = await fetch('http://localhost:3000/generate-description-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prUrl: githubUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const descriptionText = await response.text();
      setDescription(descriptionText);

      toast({
        title: 'Description generated',
        description: 'PR description has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating GitHub PR description:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate description',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setGithubUrl('');
    setReview('');
    setDescription('');
    setActiveAction(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} minH="100vh">
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading
              as="h1"
              size="xl"
              color={textColor}
              mb={2}
            >
              Pull Request Review
            </Heading>
            <Text color="gray.500" fontSize="md">
              Upload a diff file to get an AI-powered code review
            </Text>
          </Box>

          {/* Upload Section */}
          <Box
            bg={bgColor}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            p={6}
          >
            <Tabs colorScheme="brand" variant="soft-rounded">
              <TabList mb={4}>
                <Tab>Upload File</Tab>
                <Tab>GitHub PR URL</Tab>
              </TabList>

              <TabPanels>
                {/* File Upload Tab */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.diff"
                      onChange={handleFileSelect}
                      display="none"
                      id="file-upload"
                    />

                    <Flex gap={3} flexWrap="wrap">
                      <Button
                        as="label"
                        htmlFor="file-upload"
                        leftIcon={<MdUpload />}
                        colorScheme="brand"
                        variant="outline"
                        cursor="pointer"
                      >
                        Select Diff File
                      </Button>

                      <Button
                        leftIcon={<MdUpload />}
                        bg={buttonBg}
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={handleUpload}
                        isDisabled={!selectedFile || loading}
                        isLoading={loading && activeAction === 'review'}
                        loadingText="Reviewing..."
                      >
                        Review PR
                      </Button>

                      <Button
                        leftIcon={<MdUpload />}
                        colorScheme="purple"
                        onClick={handleGenerateDescription}
                        isDisabled={!selectedFile || loading}
                        isLoading={loading && activeAction === 'description'}
                        loadingText="Generating..."
                      >
                        Generate Description
                      </Button>

                      <Button
                        leftIcon={<MdRefresh />}
                        variant="ghost"
                        onClick={handleReset}
                        isDisabled={loading}
                      >
                        Reset
                      </Button>
                    </Flex>

                    {selectedFile && (
                      <Box
                        p={3}
                        bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" color={textColor}>
                          <strong>Selected file:</strong> {selectedFile.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Size: {(selectedFile.size / 1024).toFixed(2)} KB
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* GitHub URL Tab */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <MdLink color="gray" />
                      </InputLeftElement>
                      <Input
                        placeholder="https://github.com/owner/repo/pull/123"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        color={textColor}
                        borderColor={borderColor}
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </InputGroup>

                    <Flex gap={3} flexWrap="wrap">
                      <Button
                        leftIcon={<MdUpload />}
                        bg={buttonBg}
                        color="white"
                        _hover={{ opacity: 0.8 }}
                        onClick={handleUploadGithubUrl}
                        isDisabled={!githubUrl.trim() || loading}
                        isLoading={loading && activeAction === 'review'}
                        loadingText="Reviewing..."
                      >
                        Review GitHub PR
                      </Button>

                      <Button
                        leftIcon={<MdUpload />}
                        colorScheme="purple"
                        onClick={handleGenerateDescriptionGithub}
                        isDisabled={!githubUrl.trim() || loading}
                        isLoading={loading && activeAction === 'description'}
                        loadingText="Generating..."
                      >
                        Generate Description
                      </Button>

                      <Button
                        leftIcon={<MdRefresh />}
                        variant="ghost"
                        onClick={handleReset}
                        isDisabled={loading}
                      >
                        Reset
                      </Button>
                    </Flex>

                    <Box
                      p={3}
                      bg={useColorModeValue('blue.50', 'whiteAlpha.50')}
                      borderRadius="md"
                    >
                      <Text fontSize="xs" color="gray.500">
                        💡 <strong>Tip:</strong> Paste a GitHub PR URL like{' '}
                        <code>https://github.com/owner/repo/pull/123</code>
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Loading State */}
          {loading && (
            <Flex
              bg={bgColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={8}
              justify="center"
              align="center"
              direction="column"
              gap={4}
            >
              <Spinner size="xl" color={brandColor} thickness="4px" />
              <Text color={textColor}>
                {activeAction === 'review' ? 'Analyzing your PR diff...' : 'Generating PR description...'}
              </Text>
            </Flex>
          )}

          {/* PR Description Results */}
          {description && !loading && (
            <Box
              bg={bgColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={6}
            >
              <Heading as="h2" size="lg" color={textColor} mb={4}>
                📝 Generated PR Description
              </Heading>
              <Box
                maxH="70vh"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('#CBD5E0', '#4A5568'),
                    borderRadius: '4px',
                  },
                }}
              >
                <MarkdownBlock code={description} />
              </Box>
            </Box>
          )}

          {/* Review Results */}
          {review && !loading && (
            <Box
              bg={bgColor}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              p={6}
            >
              <Heading as="h2" size="lg" color={textColor} mb={4}>
                🔍 Review Results
              </Heading>
              <Box
                maxH="70vh"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('#CBD5E0', '#4A5568'),
                    borderRadius: '4px',
                  },
                }}
              >
                <MarkdownBlock code={review} />
              </Box>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
