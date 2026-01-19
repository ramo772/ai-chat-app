'use client';
/* eslint-disable */
// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { isWindowAvailable } from '@/utils/navigation';

export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
  setApiKey: any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    isWindowAvailable() && window.addEventListener('scroll', changeNavbar);

    return () => {
      isWindowAvailable() && window.removeEventListener('scroll', changeNavbar);
    };
  });

  const { secondary, brandText, setApiKey } = props;

  // Vodafone UK Professional Navbar Styling
  let mainText = useColorModeValue('#333333', 'white');
  let secondaryText = useColorModeValue('#666666', '#CCCCCC');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = scrolled ? '0 2px 12px rgba(0, 0, 0, 0.08)' : 'none';
  let navbarBg = useColorModeValue(
    'rgba(255, 255, 255, 0.95)',
    'rgba(26, 26, 26, 0.95)',
  );
  let navbarBorder = useColorModeValue('#E6E6E6', '#333333');
  let secondaryMargin = '0px';
  let gap = '0px';
  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      zIndex="100"
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="0px"
      borderWidth="0px"
      borderBottomWidth="1px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="64px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="12px"
      right={{ base: '0px', md: '0px', lg: '0px', xl: '0px' }}
      px={{
        base: '16px',
        md: '24px',
      }}
      ps={{
        base: '16px',
        md: '24px',
      }}
      pt="12px"
      top="0px"
      w={{
        base: '100vw',
        md: '100vw',
        lg: '100vw',
        xl: 'calc(100vw - 300px)',
        '2xl': 'calc(100vw - 300px)',
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        mb={gap}
      >
        <Box mb={{ base: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={secondaryText} fontSize="sm">
              <BreadcrumbLink href="#" color={secondaryText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {/* Here we create navbar brand, based on route name */}
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="34px"
            p="0px"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks setApiKey={setApiKey} secondary={props.secondary} />
        </Box>
      </Flex>
    </Box>
  );
}
