import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, alpha } from '@mui/material';
import { FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist, useRemoveFromWishlist } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';

const WishlistPage: React.FC = () => {
  const { data: wishlist, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    if (item.product) {
      addToCart(item.product, item.product.sizes[0] || 'M', item.product.colors[0] || 'Black');
      removeFromWishlist.mutate(item.product_id);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>
          My Wishlist
        </Typography>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : wishlist?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <FavoriteBorder sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>No saved items</Typography>
            <Button variant="contained" component={Link} to="/products">
              Browse Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {wishlist?.map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                  <motion.div layout exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                    <Box sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: alpha('#141414', 0.8),
                      border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: alpha('#00ff88', 0.3),
                      },
                    }}>
                      <Box
                        component={Link}
                        to={`/products/${item.product?.slug}`}
                        sx={{ display: 'block', position: 'relative', paddingTop: '120%' }}
                      >
                        <Box
                          component="img"
                          src={item.product?.images[0]}
                          alt={item.product?.name}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {item.product?.name}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ fontFamily: '"Oswald", sans-serif' }}>
                          ₹{item.product?.price.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<ShoppingCart />}
                            onClick={() => handleMoveToCart(item)}
                            fullWidth
                            sx={{ fontSize: '0.7rem' }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => removeFromWishlist.mutate(item.product_id)}
                          fullWidth
                          sx={{ mt: 1, color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WishlistPage;
