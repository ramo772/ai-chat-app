import { mode } from '@chakra-ui/theme-tools';
const Card = {
  baseStyle: (props: any) => ({
    p: '24px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    borderRadius: '8px',
    minWidth: '0px',
    wordWrap: 'break-word',
    bg: mode('#ffffff', '#2A2A2A')(props),
    boxShadow: mode(
      '0 2px 8px rgba(0, 0, 0, 0.06)',
      'unset',
    )(props),
    border: mode('1px solid #E6E6E6', '1px solid #333333')(props),
    backgroundClip: 'border-box',
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
