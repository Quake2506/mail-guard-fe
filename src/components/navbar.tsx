"use client"

import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = getCookie('access_token');
    const email = getCookie('user_email');
    setIsLoggedIn(!!token);
    if (email) setUserEmail(email.toString());
  }, [pathname]); // Use pathname as dependency to re-run effect on route changes

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    deleteCookie('access_token');
    deleteCookie('user_email');
    router.push('/login');
    handleMenuClose();
  };

  if (!mounted) {
    return (
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', margin:'5px 20px 5px 20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/next.svg"
              alt="Logo"
              width={100}
              height={24}
              priority
            />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={{ 
      bgcolor: 'white', 
      boxShadow: 0,
      borderBottom: '2px solid #bdbdbd'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', margin:'5px 20px 5px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/next.svg"
            alt="Logo"
            width={100}
            height={24}
            priority
          />
        </Box>
        {isLoggedIn && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={userEmail} arrow placement="bottom">
              <IconButton
                size="large"
                edge="end"
                color="default"
                aria-label="profile"
                onClick={handleMenuOpen}
              >
                <CircleUserRound />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}