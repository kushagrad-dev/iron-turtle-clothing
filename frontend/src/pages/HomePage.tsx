import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Skeleton, alpha, Chip,
} from '@mui/material';
import { ArrowForward, LocalShipping, Shield, Bolt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { useFeaturedProducts, useCategories } from '../hooks/useQueries';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
};

const HomePage: React.FC = () => {
  const { data: featuredData, isLoading: productsLoading } = useFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <Box>
      {/* ======= HERO SECTION ======= */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, ${alpha('#00ff88', 0.08)} 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${alpha('#ffd700', 0.06)} 0%, transparent 40%),
              linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
            `,
            zIndex: 0,
          },
        }}
      >
        {/* Animated grid pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            linear-gradient(${alpha('#fff', 0.02)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha('#fff', 0.02)} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 0,
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <Chip
                  label="NEW COLLECTION '26"
                  sx={{
                    mb: 3,
                    background: alpha('#ffd700', 0.15),
                    color: '#ffd700',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    fontSize: '0.7rem',
                    border: `1px solid ${alpha('#ffd700', 0.3)}`,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem' },
                    lineHeight: 1,
                    mb: 2,
                  }}
                >
                  FORGED IN{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 50%, #ffd700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    IRON
                  </Box>
                  <br />
                  BUILT TO{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    LAST
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 500,
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    lineHeight: 1.8,
                  }}
                >
                  Premium performance wear for athletes who refuse to compromise. Engineered fabrics.
                  Relentless design. Unbreakable spirit.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/products"
                      endIcon={<ArrowForward />}
                      sx={{ px: 5, py: 1.5, height: '100%' }}
                      id="hero-shop-btn"
                    >
                      Shop Collection
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/products?category=gym"
                      sx={{ px: 4, py: 1.5, height: '100%' }}
                    >
                      Gym Essentials
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Box sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '120%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: `0 40px 80px ${alpha('#000', 0.5)}, 0 0 60px ${alpha('#00ff88', 0.1)}`,
                    border: `1px solid ${alpha('#00ff88', 0.15)}`,
                  }}>
                    <Box
                      component="img"
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop"
                      alt="Iron Turtle Collection"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    }} />
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ======= TRUST BAR ======= */}
      <Box sx={{
        borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
        py: 3,
        background: alpha('#fff', 0.02),
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <LocalShipping />, text: 'Free Shipping Over ₹5000' },
              { icon: <Shield />, text: '30-Day Returns' },
              { icon: <Bolt />, text: 'Performance Guaranteed' },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={index}>
                <motion.div custom={index} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                    <Typography variant="body2" fontWeight={600} letterSpacing="0.05em"
                      sx={{ fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                      {item.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ======= CATEGORIES ======= */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div custom={0} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 1 }}>
                Shop by Category
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Find your armor. Every category engineered for a different battleground.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {categoriesLoading
              ? Array(4).fill(0).map((_, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={i}>
                  <Skeleton variant="rectangular" sx={{ borderRadius: 3, paddingTop: '130%' }} />
                </Grid>
              ))
              : categories?.map((cat, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={cat.id}>
                  <motion.div custom={index} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Box
                      component={Link}
                      to={`/products?category=${cat.slug}`}
                      sx={{
                        position: 'relative',
                        display: 'block',
                        paddingTop: '130%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        textDecoration: 'none',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: `0 20px 50px ${alpha('#000', 0.4)}, 0 0 30px ${alpha('#00ff88', 0.1)}`,
                          '& .cat-image': { transform: 'scale(1.1)' },
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={cat.image_url}
                        alt={cat.name}
                        className="cat-image"
                        sx={{
                          position: 'absolute',
                          top: 0, left: 0, width: '100%', height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}>
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#fff',
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                          }}
                        >
                          {cat.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, mt: 0.5 }}>
                          SHOP NOW →
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>

      {/* ======= FEATURED PRODUCTS ======= */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(180deg, ${alpha('#00ff88', 0.02)} 0%, transparent 100%)`,
      }}>
        <Container maxWidth="lg">
          <motion.div custom={0} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 1 }}>
                  Featured Drops
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Hand-picked selections from our latest collection
                </Typography>
              </Box>
              <Button
                variant="outlined"
                component={Link}
                to="/products"
                endIcon={<ArrowForward />}
              >
                View All
              </Button>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {productsLoading
              ? Array(4).fill(0).map((_, i) => (
                <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
                  <Skeleton variant="rectangular" sx={{ borderRadius: 3, paddingTop: '150%' }} />
                </Grid>
              ))
              : featuredData?.products?.map((product) => (
                <Grid size={{ xs: 6, sm: 6, md: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>

      {/* ======= CTA BANNER ======= */}
      <Box sx={{
        py: { xs: 10, md: 14 },
        textAlign: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `
            radial-gradient(ellipse at center, ${alpha('#00ff88', 0.06)} 0%, transparent 60%),
            linear-gradient(180deg, transparent 0%, ${alpha('#0a0a0a', 1)} 100%)
          `,
        },
      }}>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Join the{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #00ff88, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Movement
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              Over 50,000 athletes worldwide have chosen Iron Turtle. Train harder. Look better. Be relentless.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/products"
                sx={{ px: 6, py: 1.5 }}
              >
                Start Shopping
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
