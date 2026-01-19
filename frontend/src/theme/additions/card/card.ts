import { mode } from '@chakra-ui/theme-tools';
const Card = {
  baseStyle: (props: any) => ({
    p: '24px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    borderRadius: '12px',
    minWidth: '0px',
    wordWrap: 'break-word',
    bg: mode('#ffffff', '#2A2A2A')(props),
    boxShadow: mode(
      '0 2px 8px rgba(0, 0, 0, 0.06)',
      'unset',
    )(props),
    border: mode('none', '1px solid #333333')(props),
    backgroundClip: 'border-box',
    transition: 'all 0.2s ease',
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
