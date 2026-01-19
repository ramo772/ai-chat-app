import { Box, Text, Flex } from '@chakra-ui/react';

interface VodafoneLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function VodafoneLogo({ size = 'md', showText = true }: VodafoneLogoProps) {
  const sizes = {
    sm: { icon: '24px', text: '18px' },
    md: { icon: '32px', text: '24px' },
    lg: { icon: '48px', text: '36px' },
  };

  return (
    <Flex align="center" gap={showText ? '12px' : '0'}>
      {/* Vodafone Speech Mark Icon */}
      <Box position="relative" w={sizes[size].icon} h={sizes[size].icon}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 29.091C8.77 29.091 2.909 23.23 2.909 16S8.77 2.909 16 2.909 29.091 8.77 29.091 16 23.23 29.091 16 29.091z"
            fill="#E60000"
          />
          <path
            d="M21.818 16c0-3.214-2.604-5.818-5.818-5.818S10.182 12.786 10.182 16c0 2.143 1.158 4.012 2.885 5.027v3.337c0 .554.449 1.003 1.003 1.003h3.86c.554 0 1.003-.449 1.003-1.003v-3.337c1.727-1.015 2.885-2.884 2.885-5.027z"
            fill="#E60000"
          />
        </svg>
      </Box>
      {showText && (
        <Text
          fontSize={sizes[size].text}
          fontWeight="700"
          color="#E60000"
          letterSpacing="-0.5px"
          lineHeight="1"
        >
          Vodafone
        </Text>
      )}
    </Flex>
  );
}
