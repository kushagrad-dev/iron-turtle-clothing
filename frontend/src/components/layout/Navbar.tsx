import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Box, Menu, MenuItem,
  Avatar, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme, alpha, Container,
} from '@mui/material';
import {
  ShoppingCart, FavoriteBorder, Person, Search, Menu as MenuIcon,
  Home, Category, AdminPanelSettings, LocalShipping, Logout,
  Close, Store,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../hooks/useQueries';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, profile, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { itemCount } = useCart();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { data: searchResults } = useSearch(searchQuery);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchSelect = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/products/${slug}`);
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Shop', path: '/products', icon: <Store /> },
    { label: 'Men', path: '/products?category=men', icon: <Category /> },
    { label: 'Women', path: '/products?category=women', icon: <Category /> },
    { label: 'Gym', path: '/products?category=gym', icon: <Category /> },
    { label: 'Streetwear', path: '/products?category=streetwear', icon: <Category /> },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          transition: 'all 0.3s ease',
          ...(scrolled && {
            backgroundColor: alpha('#0a0a0a', 0.95),
            backdropFilter: 'blur(20px)',
          }),
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', height: 70, px: { xs: 0 } }}>
            {/* Left: Menu + Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton color="inherit" onClick={() => setMobileOpen(true)} id="mobile-menu-btn">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                component={Link}
                to="/"
                variant="h4"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  background: 'linear-gradient(135deg, #00ff88 0%, #ffd700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.05em',
                }}
              >
                🐢 IRON TURTLE
              </Typography>
            </Box>

            {/* Center: Nav Links (desktop) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {navLinks.map((link) => (
                  <Typography
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      textDecoration: 'none',
                      color: 'text.secondary',
                      fontFamily: '"Oswald", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        background: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Right: Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              <IconButton color="inherit" onClick={() => setSearchOpen(!searchOpen)} id="search-btn">
                <Search />
              </IconButton>

              {user && (
                <IconButton color="inherit" component={Link} to="/wishlist" id="wishlist-btn">
                  <FavoriteBorder />
                </IconButton>
              )}

              <IconButton color="inherit" component={Link} to="/cart" id="cart-btn">
                <Badge badgeContent={itemCount} color="primary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {user ? (
                <>
                  <IconButton onClick={handleProfileClick} id="profile-btn">
                    <Avatar
                      src={profile?.avatar_url || user.user_metadata?.avatar_url}
                      sx={{
                        width: 32,
                        height: 32,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        background: '#1a1a1a',
                        border: `1px solid ${alpha('#fff', 0.1)}`,
                      },
                    }}
                  >
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/orders'); }}>
                      <ListItemIcon><LocalShipping fontSize="small" /></ListItemIcon>
                      Orders
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>
                        <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                        Admin Panel
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={() => { setAnchorEl(null); signOut(); }}>
                      <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={signInWithGoogle}
                  id="login-btn"
                  sx={{
                    border: `1px solid ${alpha('#fff', 0.2)}`,
                    borderRadius: 2,
                    px: 2,
                    fontSize: '0.8rem',
                    fontFamily: '"Oswald", sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Person sx={{ mr: 0.5, fontSize: 18 }} />
                  Sign In
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{
                borderTop: `1px solid ${alpha('#fff', 0.06)}`,
                background: alpha('#0a0a0a', 0.95),
                py: 2,
                px: 3,
              }}>
                <Container maxWidth="md">
                  <Box sx={{ position: 'relative' }}>
                    <InputBase
                      autoFocus
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      fullWidth
                      id="search-input"
                      sx={{
                        background: alpha('#fff', 0.06),
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        color: 'white',
                        fontSize: '1rem',
                        '& input::placeholder': {
                          color: alpha('#fff', 0.4),
                        },
                      }}
                      endAdornment={
                        <IconButton size="small" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                          <Close fontSize="small" />
                        </IconButton>
                      }
                    />
                    {searchResults && searchResults.length > 0 && (
                      <Box sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        background: '#1a1a1a',
                        border: `1px solid ${alpha('#fff', 0.1)}`,
                        borderRadius: 2,
                        maxHeight: 300,
                        overflow: 'auto',
                        zIndex: 10,
                      }}>
                        {searchResults.map((product: any) => (
                          <Box
                            key={product.id}
                            onClick={() => handleSearchSelect(product.slug)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 1.5,
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              '&:hover': { background: alpha('#fff', 0.05) },
                            }}
                          >
                            <Box
                              component="img"
                              src={product.images?.[0]}
                              sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                              <Typography variant="caption" color="primary">${product.price}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Container>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{
            background: 'linear-gradient(135deg, #00ff88, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            IRON TURTLE
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <Divider />
        <List>
          {navLinks.map((link) => (
            <ListItem
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { background: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontFamily: '"Oswald", sans-serif',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Spacer for fixed navbar */}
      <Box sx={{ height: 70 }} />
    </>
  );
};

export default Navbar;
