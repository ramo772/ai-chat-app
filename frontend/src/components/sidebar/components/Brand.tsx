'use client';
// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('#E60000', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Text 
        fontSize="28px" 
        fontWeight="700" 
        color={logoColor} 
        my="30px"
        letterSpacing="-0.5px"
      >
        Vodafone
      </Text>
      <HSeparator mb="20px" w="284px" bg={useColorModeValue('#E6E6E6', '#333333')} />
    </Flex>
  );
}

export default SidebarBrand;
