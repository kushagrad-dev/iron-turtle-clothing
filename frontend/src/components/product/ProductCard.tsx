import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip, alpha } from '@mui/material';
import { FavoriteBorder, Favorite, ShoppingCart, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../hooks/useQueries';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = wishlist?.some(item => item.product_id === product.id);
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0] || 'M', product.colors[0] || 'Black', 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      style={{ height: '100%' }}
    >
      <Card
        component={Link}
        to={`/products/${product.slug}`}
        sx={{
          textDecoration: 'none',
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover .product-actions': { opacity: 1, transform: 'translateY(0)' },
          '&:hover .product-image': { transform: 'scale(1.05)' },
        }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <Chip
            label={`-${discount}%`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              background: 'linear-gradient(135deg, #ff4d6a, #ff1744)',
              color: '#fff',
              fontWeight: 700,
            }}
          />
        )}

        {/* Wishlist Button */}
        {user && (
          <IconButton
            onClick={handleWishlistToggle}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              background: alpha('#000', 0.5),
              backdropFilter: 'blur(4px)',
              '&:hover': { background: alpha('#000', 0.7) },
            }}
          >
            {isWishlisted ? (
              <Favorite sx={{ color: '#ff4d6a', fontSize: 20 }} />
            ) : (
              <FavoriteBorder sx={{ color: '#fff', fontSize: 20 }} />
            )}
          </IconButton>
        )}

        {/* Product Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', paddingTop: '120%' }}>
          <CardMedia
            component="img"
            image={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="product-image"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />

          {/* Quick Add Overlay */}
          <Box
            className="product-actions"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton
              onClick={handleQuickAdd}
              sx={{
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                color: '#000',
                '&:hover': { background: '#00ff88', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <ShoppingCart fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
          {/* Category */}
          {product.category && (
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: '"Oswald", sans-serif',
                fontSize: '0.65rem',
              }}
            >
              {product.category.name}
            </Typography>
          )}

          {/* Product Name */}
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.3,
              mt: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </Typography>

          {/* Rating */}
          {product.review_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Star sx={{ fontSize: 14, color: '#ffd700' }} />
              <Typography variant="caption" fontWeight={600}>
                {product.rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({product.review_count})
              </Typography>
            </Box>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Oswald", sans-serif',
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1.1rem',
              }}
            >
              ₹{product.price.toFixed(2)}
            </Typography>
            {product.compare_at_price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                }}
              >
                ₹{product.compare_at_price.toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
