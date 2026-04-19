import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, Avatar, Grid, alpha, Divider,
} from '@mui/material';
import { Save, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProfile, useUpdateProfile } from '../hooks/useQueries';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: fullName, phone });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>
          My Profile
        </Typography>

        <Box sx={{
          p: 4,
          borderRadius: 3,
          background: alpha('#141414', 0.8),
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar
              src={profile?.avatar_url || user?.user_metadata?.avatar_url}
              sx={{
                width: 80,
                height: 80,
                border: (theme) => `3px solid ${theme.palette.primary.main}`,
              }}
            >
              <Person fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5">{profile?.full_name || user?.email}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Typography variant="caption" sx={{
                color: profile?.role === 'admin' ? 'secondary.main' : 'primary.main',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {profile?.role || 'Customer'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={updateProfile.isPending}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
