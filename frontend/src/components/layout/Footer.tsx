import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, TextField, Button, alpha, Divider } from '@mui/material';
import { Instagram, YouTube, Twitter } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        borderTop: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        pt: 8,
        pb: 4,
        mt: 12,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #00ff88, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IRON TURTLE
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300, mb: 3, lineHeight: 1.8 }}>
              Forged for warriors. Engineered for performance. Iron Turtle isn't just a brand — it's an armor for the relentless.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Instagram, YouTube, Twitter].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: 'text.secondary',
                    border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem' }}>Shop</Typography>
            {['Men', 'Women', 'Gym', 'Streetwear'].map((link) => (
              <Typography
                key={link}
                component={Link}
                to={`/products?category=${link.toLowerCase()}`}
                variant="body2"
                sx={{
                  display: 'block',
                  mb: 1.5,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link}
              </Typography>
            ))}
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem' }}>Support</Typography>
            {['Sizing Guide', 'Shipping & Returns', 'Contact Us', 'FAQ'].map((link) => (
              <Typography
                key={link}
                variant="body2"
                sx={{
                  display: 'block',
                  mb: 1.5,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link}
              </Typography>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem' }}>Join the Pack</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Get exclusive drops, training tips, and 10% off your first order.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#fff', 0.04),
                  },
                }}
              />
              <Button variant="contained" size="small" sx={{ px: 3, whiteSpace: 'nowrap' }}>
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Iron Turtle. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <Typography
                key={link}
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
