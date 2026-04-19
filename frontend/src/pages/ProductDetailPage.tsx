import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Chip, Rating, Divider,
  IconButton, TextField, Avatar, Breadcrumbs, Skeleton, alpha, Tab, Tabs,
} from '@mui/material';
import {
  Add, Remove, FavoriteBorder, Favorite, ShoppingCart, Star, ArrowBack,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct, useReviews, useCreateReview, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: reviews } = useReviews(product?.id || '');
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const createReview = useCreateReview();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const isWishlisted = wishlist?.some(item => item.product_id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize || product.sizes[0] || '', selectedColor || product.colors[0] || '', quantity);
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    try {
      await createReview.mutateAsync({
        product_id: product.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted!');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" sx={{ borderRadius: 3, paddingTop: '120%' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" width="60%" height={50} />
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="100%" height={100} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4">Product not found</Typography>
        <Button component={Link} to="/products" startIcon={<ArrowBack />} sx={{ mt: 3 }}>
          Back to Shop
        </Button>
      </Container>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Box sx={{ py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Typography component={Link} to="/" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Home
          </Typography>
          <Typography component={Link} to="/products" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Shop
          </Typography>
          {product.category && (
            <Typography component={Link} to={`/products?category=${product.category.slug}`} color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              {product.category.name}
            </Typography>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Box sx={{
                  position: 'relative',
                  paddingTop: '120%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                  mb: 2,
                }}>
                  <Box
                    component="img"
                    src={product.images[selectedImage] || ''}
                    alt={product.name}
                    sx={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </motion.div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {product.images.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: (theme) => `2px solid ${index === selectedImage ? theme.palette.primary.main : alpha('#fff', 0.1)}`,
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <Box component="img" src={img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {product.category && (
                <Chip label={product.category.name} size="small" sx={{ mb: 2 }} />
              )}

              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 1 }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Rating value={product.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({product.review_count} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h3" sx={{
                  color: 'primary.main',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}>
                  ₹{product.price.toFixed(2)}
                </Typography>
                {product.compare_at_price && (
                  <>
                    <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                      ₹{product.compare_at_price.toFixed(2)}
                    </Typography>
                    <Chip label={`SAVE ${discount}%`} size="small" sx={{
                      background: alpha('#ff4d6a', 0.15),
                      color: '#ff4d6a',
                      fontWeight: 700,
                    }} />
                  </>
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Size
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.sizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        onClick={() => setSelectedSize(size)}
                        variant={selectedSize === size ? 'filled' : 'outlined'}
                        sx={{
                          minWidth: 48,
                          fontWeight: 700,
                          fontFamily: '"Oswald", sans-serif',
                          ...(selectedSize === size && {
                            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                            color: '#000',
                          }),
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Color: {selectedColor}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.colors.map((color) => (
                      <Chip
                        key={color}
                        label={color}
                        onClick={() => setSelectedColor(color)}
                        variant={selectedColor === color ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Oswald", sans-serif',
                          ...(selectedColor === color && {
                            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                            color: '#000',
                          }),
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Quantity & Add to Cart */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                  borderRadius: 2,
                }}>
                  <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700, fontFamily: '"Oswald", sans-serif' }}>
                    {quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => setQuantity(quantity + 1)}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  sx={{ flex: 1, py: 1.5 }}
                  id="add-to-cart-btn"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                {user && (
                  <IconButton
                    onClick={() => isWishlisted ? removeFromWishlist.mutate(product.id) : addToWishlist.mutate(product.id)}
                    sx={{
                      border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                      borderRadius: 2,
                      p: 1.5,
                    }}
                  >
                    {isWishlisted
                      ? <Favorite sx={{ color: '#ff4d6a' }} />
                      : <FavoriteBorder />
                    }
                  </IconButton>
                )}
              </Box>

              {/* Stock */}
              <Typography variant="caption" color={product.stock > 10 ? 'success.main' : 'error.main'}>
                {product.stock > 10 ? `✓ In Stock (${product.stock} available)` : product.stock > 0 ? `⚡ Only ${product.stock} left!` : '✗ Out of Stock'}
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Box sx={{ mt: 8 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
            <Tab label="Reviews" sx={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, letterSpacing: '0.05em' }} />
            <Tab label="Details" sx={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, letterSpacing: '0.05em' }} />
          </Tabs>

          {tab === 0 && (
            <Box>
              {/* Write Review */}
              {user && (
                <Box sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  background: alpha('#fff', 0.03),
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Write a Review</Typography>
                  <Rating
                    value={reviewRating}
                    onChange={(_, v) => setReviewRating(v || 5)}
                    size="large"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Share your thoughts about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={createReview.isPending}
                  >
                    Submit Review
                  </Button>
                </Box>
              )}

              {/* Reviews List */}
              {reviews?.map((review) => (
                <Box key={review.id} sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 2,
                  background: alpha('#fff', 0.02),
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar src={review.profile?.avatar_url} sx={{ width: 36, height: 36 }}>
                      {review.profile?.full_name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.profile?.full_name || 'Anonymous'}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {review.comment && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  )}
                </Box>
              ))}

              {reviews?.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No reviews yet. Be the first to review this product!
                </Typography>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>
                {product.description}
              </Typography>
              <Box sx={{ mt: 3 }}>
                {[
                  ['Available Sizes', product.sizes.join(', ')],
                  ['Available Colors', product.colors.join(', ')],
                  ['Category', product.category?.name || 'N/A'],
                ].map(([label, value]) => (
                  <Box key={label as string} sx={{ display: 'flex', py: 1.5, borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}` }}>
                    <Typography variant="body2" fontWeight={600} sx={{ width: 160 }}>{label}</Typography>
                    <Typography variant="body2" color="text.secondary">{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
