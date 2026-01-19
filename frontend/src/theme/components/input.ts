import { mode } from '@chakra-ui/theme-tools';
export const inputStyles = {
  components: {
    Input: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: '8px',
        },
      },

      variants: {
        main: (props: any) => ({
          field: {
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            color: mode('#333333', 'white')(props),
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            fontSize: 'sm',
            p: '16px',
            _placeholder: { color: '#999999' },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        auth: (props: any) => ({
          field: {
            fontWeight: '400',
            color: mode('#333333', 'white')(props),
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            _placeholder: {
              color: '#999999',
              fontWeight: '400',
            },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        authSecondary: (props: any) => ({
          field: {
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            _placeholder: { color: '#999999' },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        search: (props: any) => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: '#999999' },
          },
        }),
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          fontWeight: 400,
        },
      },

      variants: {
        main: (props: any) => ({
          field: {
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            _placeholder: { color: '#999999' },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        auth: (props: any) => ({
          field: {
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            _placeholder: { color: '#999999' },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        authSecondary: (props: any) => ({
          field: {
            bg: mode('white', '#2A2A2A')(props),
            border: '2px solid',
            borderColor: mode('#E6E6E6', '#4A4A4A')(props),
            borderRadius: '8px',
            _placeholder: { color: '#999999' },
            _hover: {
              borderColor: mode('#999999', '#666666')(props),
            },
            _focus: {
              borderColor: '#E60000',
              boxShadow: '0 0 0 1px #E60000',
            },
          },
        }),
        search: () => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: 'gray.500' },
          },
        }),
      },
    },
    Select: {
      baseStyle: {
        field: {
          fontWeight: 500,
        },
      },

      variants: {
        main: (props: any) => ({
          field: {
            bg: mode('transparent', 'navy.800')(props),
            border: '1px solid',
            color: 'gray.500',
            borderColor: mode('gray.200', 'whiteAlpha.100')(props),
            borderRadius: '12px',
            _placeholder: { color: 'navy.700' },
          },
          icon: {
            color: 'gray.500',
          },
        }),
        mini: (props: any) => ({
          field: {
            bg: mode('transparent', 'navy.800')(props),
            border: '0px solid transparent',
            fontSize: '0px',
            p: '10px',
            _placeholder: { color: 'navy.700' },
          },
          icon: {
            color: 'gray.500',
          },
        }),
        subtle: () => ({
          box: {
            width: 'unset',
          },
          field: {
            bg: 'transparent',
            border: '0px solid',
            color: 'gray.500',
            borderColor: 'transparent',
            width: 'max-content',
            _placeholder: { color: 'navy.700' },
          },
          icon: {
            color: 'gray.500',
          },
        }),
        transparent: (props: any) => ({
          field: {
            bg: 'transparent',
            border: '0px solid',
            width: 'min-content',
            color: mode('gray.500', 'gray.500')(props),
            borderColor: 'transparent',
            padding: '0px',
            paddingLeft: '8px',
            paddingRight: '20px',
            fontWeight: '700',
            fontSize: '14px',
            _placeholder: { color: 'navy.700' },
          },
          icon: {
            transform: 'none !important',
            position: 'unset !important',
            width: 'unset',
            color: 'gray.500',
            right: '0px',
          },
        }),
        auth: () => ({
          field: {
            bg: 'transparent',
            border: '1px solid',
            borderColor: 'gray.200',
            borderRadius: '12px',
            _placeholder: { color: 'navy.700' },
          },
        }),
        authSecondary: (props: any) => ({
          field: {
            bg: 'transparent',
            border: '1px solid',

            borderColor: 'gray.200',
            borderRadius: '12px',
            _placeholder: { color: 'navy.700' },
          },
        }),
        search: (props: any) => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: 'navy.700' },
          },
        }),
      },
    },
  },
};
