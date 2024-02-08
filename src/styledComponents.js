import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const ColorButton = styled(Button)(({ theme, color }) => ({
    backgroundColor: color === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main,
    textTransform: 'capitalize',
    color: 'white',
    '&:hover': {
      backgroundColor: color === 'primary' ? theme.palette.primary.dark : theme.palette.secondary.dark,
    },
}));