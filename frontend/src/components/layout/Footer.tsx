import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, TextField, Button, alpha, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Instagram, YouTube, Twitter, Email, Phone, LocationOn, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MotionBox = motion.create(Box as React.FC<any>);

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const socialLinks = [
  { Icon: Instagram, url: 'https://instagram.com/ironturtleclothing', label: 'Instagram' },
  { Icon: YouTube, url: 'https://youtube.com/@ironturtleclothing', label: 'YouTube' },
  { Icon: Twitter, url: 'https://x.com/ironturtlegym', label: 'X (Twitter)' },
];

const supportPages: Record<string, { title: string; content: string }> = {
  'Sizing Guide': {
    title: '📏 Sizing Guide',
    content: `We recommend measuring yourself before ordering for the best fit.\n\n**Men's Tops:**\n• S: Chest 36-38" | Waist 28-30"\n• M: Chest 38-40" | Waist 30-32"\n• L: Chest 40-42" | Waist 32-34"\n• XL: Chest 42-44" | Waist 34-36"\n• XXL: Chest 44-46" | Waist 36-38"\n\n**Women's Tops:**\n• XS: Chest 30-32" | Waist 24-26"\n• S: Chest 32-34" | Waist 26-28"\n• M: Chest 34-36" | Waist 28-30"\n• L: Chest 36-38" | Waist 30-32"\n• XL: Chest 38-40" | Waist 32-34"\n\n**Bottoms:**\nOur joggers and leggings use a tapered/compression fit. If you're between sizes, we recommend sizing up for a more relaxed fit.\n\n**Still unsure?** Contact us at ironturtle21@gmail.com and we'll help you find your perfect size!`,
  },
  'Shipping & Returns': {
    title: '🚚 Shipping & Returns',
    content: `**Shipping:**\n• Orders over ₹5,000 ship FREE across India\n• Orders under ₹5,000 incur a flat ₹499 shipping fee\n• Standard delivery: 5-7 business days\n• Express delivery: 2-3 business days (₹299 extra)\n• We ship to all pincodes in India\n\n**Returns:**\n• 30-day hassle-free return policy\n• Items must be unworn, unwashed, with original tags\n• Return shipping is FREE for defective items\n• Refunds are processed within 5-7 business days\n\n**Exchanges:**\n• Size exchanges are FREE — just contact us within 30 days\n• Subject to stock availability\n\nFor any shipping queries, email us at ironturtle21@gmail.com`,
  },
  'Contact Us': {
    title: '📞 Contact Us',
    content: `We'd love to hear from you!\n\n**Email:** ironturtle21@gmail.com\n**Phone:** +91 98765 43210\n**Hours:** Mon-Sat, 10:00 AM - 7:00 PM IST\n\n**Office Address:**\nIron Turtle Pvt. Ltd.\n42, Fitness Hub Road\nKoramangala, Bengaluru 560034\nKarnataka, India\n\n**Follow us on social media for the latest drops and fitness content!**\n\nFor bulk/corporate orders, email us at ironturtle21@gmail.com`,
  },
  'FAQ': {
    title: '❓ Frequently Asked Questions',
    content: `**Q: How do I track my order?**\nA: Once shipped, you'll receive a tracking link via email and SMS.\n\n**Q: Can I cancel my order?**\nA: Orders can be cancelled within 2 hours of placing. After that, the order enters processing.\n\n**Q: Do you offer COD (Cash on Delivery)?**\nA: Currently we accept prepaid orders only via UPI, cards, and net banking. COD coming soon!\n\n**Q: Are your products squat-proof?**\nA: Yes! Our leggings and joggers are squat-tested and designed for full range of motion.\n\n**Q: How do I become an Iron Turtle ambassador?**\nA: Send us a DM on Instagram @ironturtleclothing with your fitness profile!\n\n**Q: Do you ship internationally?**\nA: Not yet, but we're working on it! Stay tuned.\n\n**Q: What payment methods do you accept?**\nA: UPI, Credit/Debit Cards, Net Banking, and popular wallets.`,
  },
  'Privacy Policy': {
    title: '🔒 Privacy Policy',
    content: `**Last Updated: April 2026**\n\nIron Turtle Pvt. Ltd. respects your privacy. This policy explains how we collect, use, and protect your data.\n\n**Information We Collect:**\n• Name, email, phone number (during registration)\n• Shipping address (during checkout)\n• Payment info (processed securely via Razorpay — we don't store card details)\n• Browsing and order history\n\n**How We Use Your Information:**\n• Process and deliver your orders\n• Send order updates and tracking info\n• Improve our products and website experience\n• Send marketing emails (only with your consent)\n\n**Data Protection:**\n• All data is encrypted with SSL/TLS\n• We never sell your data to third parties\n• You can request data deletion at any time\n\n**Contact:** ironturtle21@gmail.com`,
  },
  'Terms of Service': {
    title: '📄 Terms of Service',
    content: `**Last Updated: April 2026**\n\nBy using ironturtle.in, you agree to these terms.\n\n**Products:**\n• All products are subject to availability\n• Prices are in Indian Rupees (₹) and inclusive of GST\n• We reserve the right to modify prices without notice\n• Product images are representative; actual colors may vary slightly\n\n**Orders:**\n• An order confirmation email constitutes acceptance of your order\n• We reserve the right to cancel orders due to stock issues\n• Full refund will be issued for cancelled orders\n\n**Intellectual Property:**\n• All content, logos, and designs are property of Iron Turtle Pvt. Ltd.\n• Unauthorized use is prohibited\n\n**Limitation of Liability:**\n• Iron Turtle is not liable for delays caused by shipping carriers\n• Maximum liability is limited to the order value\n\n**Governing Law:**\nThese terms are governed by the laws of India. Disputes fall under the jurisdiction of Bengaluru courts.\n\n**Contact:** ironturtle21@gmail.com`,
  },
};

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success(`Welcome to the pack, ${email.split('@')[0]}! 🐢`);
    setEmail('');
  };

  const openSupportPage = (page: string) => {
    setDialogContent(supportPages[page]);
    setDialogOpen(true);
  };

  return (
    <>
      <MotionBox
        component="footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={footerVariants}
        sx={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
          borderTop: (theme: any) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          pt: 8,
          pb: 4,
          mt: 12,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Brand */}
            <Grid size={{ xs: 12, md: 4 }}>
              <MotionBox variants={itemVariants}>
                <Typography
                  component={Link}
                  to="/"
                  variant="h3"
                  sx={{
                    display: 'block',
                    mb: 2,
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #00ff88, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  IRON TURTLE
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: 300, mb: 3, lineHeight: 1.8 }}>
                  Forged for warriors. Engineered for performance. Iron Turtle isn't just a brand — it's an armor for the relentless.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {socialLinks.map(({ Icon, url, label }) => (
                    <motion.div key={label} whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.95 }}>
                      <IconButton
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        sx={{
                          color: 'text.secondary',
                          border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                          },
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
                {/* Contact Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box
                    component="a"
                    href="mailto:ironturtle21@gmail.com"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}
                  >
                    <Email sx={{ fontSize: 16 }} /> ironturtle21@gmail.com
                  </Box>
                  <Box
                    component="a"
                    href="tel:+919876543210"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}
                  >
                    <Phone sx={{ fontSize: 16 }} /> +91 98765 43210
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem' }}
                  >
                    <LocationOn sx={{ fontSize: 16 }} /> Bengaluru, India
                  </Box>
                </Box>
              </MotionBox>
            </Grid>

            {/* Shop Links */}
            <Grid size={{ xs: 6, md: 2 }}>
              <MotionBox variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shop</Typography>
                {['Men', 'Women', 'Gym', 'Streetwear'].map((link) => (
                  <motion.div key={link} whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                    <Typography
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
                  </motion.div>
                ))}
                <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                  <Typography
                    component={Link}
                    to="/products"
                    variant="body2"
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      textDecoration: 'none',
                      color: 'primary.main',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#ffd700' },
                    }}
                  >
                    View All →
                  </Typography>
                </motion.div>
              </MotionBox>
            </Grid>

            {/* Support */}
            <Grid size={{ xs: 6, md: 2 }}>
              <MotionBox variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Support</Typography>
                {['Sizing Guide', 'Shipping & Returns', 'Contact Us', 'FAQ'].map((link) => (
                  <motion.div key={link} whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                    <Typography
                      variant="body2"
                      onClick={() => openSupportPage(link)}
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
                  </motion.div>
                ))}
              </MotionBox>
            </Grid>

            {/* Newsletter */}
            <Grid size={{ xs: 12, md: 4 }}>
              <MotionBox variants={itemVariants}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Join the Pack</Typography>
                <Typography variant="body2" sx={{ mb: 2
                 }}>
                  Get exclusive drops, training tips, and 10% off your first order.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter your email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha('#fff', 0.04),
                      },
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSubscribe}
                      sx={{ px: 3, whiteSpace: 'nowrap', height: '100%' }}
                    >
                      Subscribe
                    </Button>
                  </motion.div>
                </Box>

                {/* Quick Account Links */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {[
                    { label: 'My Orders', path: '/orders' },
                    { label: 'Wishlist', path: '/wishlist' },
                    { label: 'Profile', path: '/profile' },
                    { label: 'Cart', path: '/cart' },
                  ].map((item) => (
                    <Typography
                      key={item.label}
                      component={Link}
                      to={item.path}
                      variant="caption"
                      sx={{
                        textDecoration: 'none',
                        color: 'text.secondary',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <MotionBox
            variants={itemVariants}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}
          >
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Iron Turtle Pvt. Ltd. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy Policy', 'Terms of Service'].map((link) => (
                <Typography
                  key={link}
                  variant="caption"
                  onClick={() => openSupportPage(link)}
                  sx={{
                    color: 'text.secondary',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </MotionBox>
        </Container>
      </MotionBox>

      {/* Support Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)',
              border: (theme: any) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Oswald", sans-serif',
          fontSize: '1.5rem',
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {dialogContent.title}
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}
          >
            {dialogContent.content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" size="small">
            Close
          </Button>
          <Button onClick={() => { setDialogOpen(false); navigate('/products'); }} variant="contained" size="small">
            Shop Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Footer;
