import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', margin:'5px 20px 5px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="next.svg"
            alt="Logo"
            width={100}
            height={24}
            priority
          />
        </Box>
        <IconButton
          size="large"
          edge="end"
          color="default"
          aria-label="profile"
        >
          <CircleUserRound />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}