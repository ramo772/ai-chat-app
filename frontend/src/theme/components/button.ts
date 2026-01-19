import { mode } from '@chakra-ui/theme-tools';
export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: '4px',
        boxShadow: 'none',
        transition: '.2s all ease',
        boxSizing: 'border-box',
        fontWeight: '600',
        _focus: {
          boxShadow: 'none',
        },
        _active: {
          boxShadow: 'none',
        },
      },
      variants: {
        transparent: (props: any) => ({
          bg: mode('transparent', 'transparent')(props),
          color: mode('#333333', 'white')(props),
          boxShadow: 'none',
          _focus: {
            bg: mode('none', 'whiteAlpha.200')(props),
          },
          _active: {
            bg: mode('#F4F4F4', 'whiteAlpha.200')(props),
          },
          _hover: {
            boxShadow: 'unset',
            bg: mode('#F4F4F4', 'whiteAlpha.100')(props),
          },
        }),
        a: (props: any) => ({
          bg: mode('transparent', 'transparent')(props),
          color: mode('transparent', 'transparent')(props),
          padding: 0,
          _focus: {
            bg: mode('transparent', 'transparent')(props),
          },
          _active: {
            bg: mode('transparent', 'transparent')(props),
          },
          _hover: {
            boxShadow: 'unset',
            textDecoration: 'underline',
            bg: mode('transparent', 'transparent')(props),
          },
        }),
        primary: (props: any) => ({
          bg: mode('#E60000', '#E60000')(props),
          color: 'white',
          boxShadow: 'none',
          _focus: {
            bg: mode('#CC0000', '#CC0000')(props),
          },
          _active: {
            bg: mode('#990000', '#990000')(props),
            transform: 'scale(0.98)',
          },
          _hover: {
            bg: mode('#CC0000', '#CC0000')(props),
            boxShadow: '0 4px 12px rgba(230, 0, 0, 0.25)',
            _disabled: {
              bg: mode('#E60000', '#E60000')(props),
            },
          },
          _disabled: {
            bg: mode('#FFB3B3', '#660000')(props),
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }),
        red: (props: any) => ({
          bg: mode('#FFE5E5', 'whiteAlpha.100')(props),
          color: mode('#E60000', 'white')(props),
          boxShadow: 'none',
          _focus: {
            bg: mode('#FFE5E5', 'whiteAlpha.100')(props),
          },
          _active: {
            bg: mode('#FFB3B3', 'whiteAlpha.100')(props),
          },
          _hover: {
            bg: mode('#FFB3B3', 'whiteAlpha.200')(props),
          },
        }),
        chakraLinear: (props: any) => ({
          bg: mode('#E60000', '#E60000')(props),
          color: 'white',
          boxShadow: 'none',
          _focus: {
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
          _active: {
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
          _hover: {
            boxShadow:
              '0px 21px 27px -10px rgba(67, 200, 192, 0.47) !important',
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
        }),
        outline: () => ({
          borderRadius: '16px',
        }),
        api: (props: any) => ({
          bg: mode('navy.700', 'whiteAlpha.200')(props),
          color: mode('white', 'white')(props),
          _focus: {
            bg: mode('navy.700', 'whiteAlpha.200')(props),
          },
          _active: {
            bg: mode('navy.700', 'whiteAlpha.400')(props),
          },
          _hover: {
            bg: mode('navy.800', 'whiteAlpha.300')(props),
            boxShadow: 'unset',
          },
        }),
        brand: (props: any) => ({
          bg: mode('brand.500', 'brand.400')(props),
          color: 'white',
          _focus: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _active: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.600', 'brand.400')(props),
            boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48)',
          },
        }),
        darkBrand: (props: any) => ({
          bg: mode('brand.900', 'brand.400')(props),
          color: 'white',
          _focus: {
            bg: mode('brand.900', 'brand.400')(props),
          },
          _active: {
            bg: mode('brand.900', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.800', 'brand.400')(props),
          },
        }),
        lightBrand: (props: any) => ({
          bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
          color: mode('brand.500', 'white')(props),
          _focus: {
            bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _hover: {
            bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
          },
        }),
        light: (props: any) => ({
          bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          color: mode('navy.700', 'white')(props),
          _focus: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _hover: {
            bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
          },
        }),
        action: (props: any) => ({
          fontWeight: '500',
          borderRadius: '50px',
          bg: mode('secondaryGray.300', 'brand.400')(props),
          color: mode('brand.500', 'white')(props),
          _focus: {
            bg: mode('secondaryGray.300', 'brand.400')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'brand.400')(props),
          },
          _hover: {
            bg: mode('gray.200', 'brand.400')(props),
          },
        }),
        setup: (props: any) => ({
          fontWeight: '500',
          borderRadius: '50px',
          bg: mode('transparent', 'brand.400')(props),
          border: mode('1px solid', '0px solid')(props),
          borderColor: mode('secondaryGray.400', 'transparent')(props),
          color: mode('navy.700', 'white')(props),
          _focus: {
            bg: mode('transparent', 'brand.400')(props),
          },
          _active: { bg: mode('transparent', 'brand.400')(props) },
          _hover: {
            bg: mode('gray.200', 'brand.400')(props),
          },
        }),
      },
    },
    MenuButton: {
      baseStyle: {
        borderRadius: '16px',
        transition: '.25s all ease',
        boxSizing: 'border-box',
        _focus: {
          boxShadow: 'none',
        },
        _active: {
          boxShadow: 'none',
        },
      },
      variants: {
        transparent: (props: any) => ({
          bg: mode('transparent', 'transparent')(props),
          color: mode('navy.700', 'white')(props),
          boxShadow: 'none',
          _focus: {
            bg: mode('gray.300', 'whiteAlpha.200')(props),
          },
          _active: {
            bg: mode('gray.300', 'whiteAlpha.200')(props),
          },
          _hover: {
            boxShadow: 'unset',
            bg: mode('gray.200', 'whiteAlpha.100')(props),
          },
        }),
        primary: (props: any) => ({
          bg: mode(
            'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
            'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
          )(props),
          color: 'white',
          boxShadow: 'none',
          _focus: {
            bg: mode(
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
            )(props),
          },
          _active: {
            bg: mode(
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
            )(props),
          },
          _hover: {
            boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
            bg: mode(
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            )(props),
            _disabled: {
              bg: mode(
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              )(props),
            },
          },
        }),
        chakraLinear: (props: any) => ({
          bg: mode(
            'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
          )(props),
          color: 'white',
          boxShadow: 'none',
          _focus: {
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
          _active: {
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
          _hover: {
            boxShadow:
              '0px 21px 27px -10px rgba(67, 200, 192, 0.47) !important',
            bg: mode(
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
              'linear-gradient(15.46deg, #7BCBD4 0%, #29C6B7 100%)',
            )(props),
          },
        }),
        outline: () => ({
          borderRadius: '16px',
        }),
        api: (props: any) => ({
          bg: mode('navy.700', 'white')(props),
          color: mode('white', 'navy.700')(props),
          _focus: {
            bg: mode('navy.700', 'white')(props),
          },
          _active: {
            bg: mode('navy.700', 'white')(props),
          },
          _hover: {
            bg: mode('navy.800', 'whiteAlpha.800')(props),
            boxShadow: 'unset',
          },
        }),
        brand: (props: any) => ({
          bg: mode('brand.500', 'brand.400')(props),
          color: 'white',
          _focus: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _active: {
            bg: mode('brand.500', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.600', 'brand.400')(props),
            boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48)',
          },
        }),
        darkBrand: (props: any) => ({
          bg: mode('brand.900', 'brand.400')(props),
          color: 'white',
          _focus: {
            bg: mode('brand.900', 'brand.400')(props),
          },
          _active: {
            bg: mode('brand.900', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.800', 'brand.400')(props),
          },
        }),
        lightBrand: (props: any) => ({
          bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
          color: mode('brand.500', 'white')(props),
          _focus: {
            bg: mode('#F2EFFF', 'whiteAlpha.100')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _hover: {
            bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
          },
        }),
        light: (props: any) => ({
          bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          color: mode('navy.700', 'white')(props),
          _focus: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'whiteAlpha.100')(props),
          },
          _hover: {
            bg: mode('secondaryGray.400', 'whiteAlpha.200')(props),
          },
        }),
        action: (props: any) => ({
          fontWeight: '500',
          borderRadius: '50px',
          bg: mode('secondaryGray.300', 'brand.400')(props),
          color: mode('brand.500', 'white')(props),
          _focus: {
            bg: mode('secondaryGray.300', 'brand.400')(props),
          },
          _active: {
            bg: mode('secondaryGray.300', 'brand.400')(props),
          },
          _hover: {
            bg: mode('gray.200', 'brand.400')(props),
          },
        }),
        setup: (props: any) => ({
          fontWeight: '500',
          borderRadius: '50px',
          bg: mode('transparent', 'brand.400')(props),
          border: mode('1px solid', '0px solid')(props),
          borderColor: mode('secondaryGray.400', 'transparent')(props),
          color: mode('navy.700', 'white')(props),
          _focus: {
            bg: mode('transparent', 'brand.400')(props),
          },
          _active: { bg: mode('transparent', 'brand.400')(props) },
          _hover: {
            bg: mode('gray.200', 'brand.400')(props),
          },
        }),
      },
    },
  },
};
