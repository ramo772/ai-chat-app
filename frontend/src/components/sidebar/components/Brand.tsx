'use client';
// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  return (
    <Flex alignItems="center" flexDirection="column" py="32px">
      <Image
        src="/img/vf-logo-large.png"
        alt="Vodafone"
        h="50px"
        objectFit="contain"
        mb="8px"
      />
      <HSeparator mb="20px" mt="32px" bg={useColorModeValue('#E6E6E6', '#333333')} />
    </Flex>
  );
}

export default SidebarBrand;
