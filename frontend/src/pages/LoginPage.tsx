import React from 'react';
import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { Google } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <Box sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at center, ${alpha('#00ff88', 0.06)} 0%, transparent 60%)`,
      },
    }}>
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{
            p: 5,
            borderRadius: 4,
            background: alpha('#141414', 0.9),
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
          }}>
            <Typography
              variant="h3"
              sx={{
                mb: 1,
                background: 'linear-gradient(135deg, #00ff88, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IRON TURTLE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Sign in to access your account, orders, and wishlist
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<Google />}
              onClick={signInWithGoogle}
              sx={{
                py: 1.5,
                borderColor: alpha('#fff', 0.2),
                color: '#fff',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: alpha('#00ff88', 0.08),
                },
              }}
              id="google-login-btn"
            >
              Continue with Google
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
