import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, IconButton, Divider, alpha,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowForward, ArrowBack } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.3 }} />
        <Typography variant="h3" sx={{ mb: 2 }}>Your Cart is Empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any items yet. Time to gear up.
        </Typography>
        <Button variant="contained" component={Link} to="/products" startIcon={<ArrowBack />}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>
          Shopping Cart ({itemCount})
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{
                    display: 'flex',
                    gap: { xs: 2, md: 3 },
                    p: { xs: 2, md: 3 },
                    mb: 2,
                    borderRadius: 3,
                    background: alpha('#141414', 0.8),
                    border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: alpha('#00ff88', 0.2) },
                  }}>
                    {/* Image */}
                    <Box
                      component={Link}
                      to={`/products/${item.product.slug}`}
                      sx={{
                        width: { xs: 80, md: 120 },
                        height: { xs: 100, md: 140 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={item.product.images[0]}
                        alt={item.product.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    {/* Details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <Box>
                        <Typography
                          component={Link}
                          to={`/products/${item.product.slug}`}
                          variant="h6"
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' · '}
                          {item.color && `Color: ${item.color}`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                        {/* Quantity */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                          borderRadius: 1.5,
                        }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}>
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: 1.5, fontWeight: 700, fontFamily: '"Oswald", sans-serif', fontSize: '0.9rem' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}>
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Price */}
                        <Typography variant="h6" sx={{
                          color: 'primary.main',
                          fontFamily: '"Oswald", sans-serif',
                          fontWeight: 700,
                          fontSize: { xs: '1rem', md: '1.2rem' },
                        }}>
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </Typography>

                        {/* Delete */}
                        <IconButton
                          onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#ff4d6a' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="text" component={Link} to="/products" startIcon={<ArrowBack />}>
                Continue Shopping
              </Button>
              <Button variant="text" onClick={clearCart} sx={{ color: 'text.secondary' }}>
                Clear Cart
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{
              p: 4,
              borderRadius: 3,
              background: alpha('#141414', 0.8),
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
              position: 'sticky',
              top: 90,
            }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Order Summary</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal ({itemCount} items)</Typography>
                <Typography fontWeight={600}>₹{total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight={600} color="primary.main">
                  {total >= 5000 ? 'FREE' : '₹499'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  ₹{(total + (total >= 5000 ? 0 : 499)).toFixed(2)}
                </Typography>
              </Box>

              {total < 5000 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
                  Add ₹{(5000 - total).toFixed(2)} more for free shipping!
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/checkout')}
                sx={{ py: 1.5 }}
                id="checkout-btn"
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
