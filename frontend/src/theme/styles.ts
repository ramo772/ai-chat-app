import { mode } from '@chakra-ui/theme-tools';
export const globalStyles = {
  colors: {
    // Vodafone UK Brand Colors
    brand: {
      100: '#FFE5E5', // Light red tint
      200: '#FFB3B3', // Lighter red
      300: '#FF8080', // Light red
      400: '#FF4D4D', // Medium red
      500: '#E60000', // Vodafone Red (Primary)
      600: '#CC0000', // Dark red
      700: '#990000', // Darker red
      800: '#660000', // Very dark red
      900: '#330000', // Deepest red
    },
    brandScheme: {
      100: '#FFE5E5',
      200: '#FFB3B3',
      300: '#FF8080',
      400: '#FF4D4D',
      500: '#E60000', // Vodafone Red
      600: '#CC0000',
      700: '#990000',
      800: '#660000',
      900: '#330000',
    },
    brandTabs: {
      100: '#FFE5E5',
      200: '#E60000',
      300: '#E60000',
      400: '#E60000',
      500: '#E60000', // Vodafone Red
      600: '#CC0000',
      700: '#990000',
      800: '#660000',
      900: '#330000',
    },
    vodafone: {
      red: '#E60000',
      darkGrey: '#333333',
      charcoal: '#4A4A4A',
      lightGrey: '#F4F4F4',
      mediumGrey: '#999999',
      white: '#FFFFFF',
      black: '#000000',
    },
    secondaryGray: {
      100: '#F4F4F4', // Vodafone light grey
      200: '#E6E6E6',
      300: '#F4F4F4',
      400: '#DDDDDD',
      500: '#999999', // Vodafone medium grey
      600: '#7A7A7A',
      700: '#666666',
      800: '#4A4A4A',
      900: '#333333', // Vodafone dark grey
    },
    red: {
      100: '#FFE5E5',
      500: '#E60000', // Vodafone Red
      600: '#CC0000',
    },
    blue: {
      50: '#F0F4FF',
      500: '#0066CC',
    },
    orange: {
      100: '#FFF6E5',
      500: '#FF9900',
    },
    green: {
      100: '#E6F7ED',
      500: '#00A651',
    },
    white: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },
    navy: {
      50: '#F4F4F4',
      100: '#E6E6E6',
      200: '#CCCCCC',
      300: '#999999',
      400: '#666666',
      500: '#4A4A4A',
      600: '#333333',
      700: '#2A2A2A',
      800: '#1A1A1A',
      900: '#0D0D0D',
    },
    gray: {
      100: '#F4F4F4', // Vodafone light grey
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('#FFFFFF', '#1A1A1A')(props),
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: mode('#333333', '#FFFFFF')(props),
      },
      input: {
        color: 'gray.700',
      },
      html: {
        fontFamily: 'Plus Jakarta Sans',
      },
    }),
  },
};
