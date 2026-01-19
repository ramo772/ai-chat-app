import { Flex, Box, keyframes } from '@chakra-ui/react';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

export default function LoadingDots() {
  return (
    <Flex gap="8px" align="center" justify="center" py="8px">
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#E60000"
        animation={`${bounce} 1.4s infinite ease-in-out both`}
        sx={{
          animationDelay: '-0.32s',
        }}
      />
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#E60000"
        animation={`${bounce} 1.4s infinite ease-in-out both`}
        sx={{
          animationDelay: '-0.16s',
        }}
      />
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#E60000"
        animation={`${bounce} 1.4s infinite ease-in-out both`}
      />
    </Flex>
  );
}
