const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dns = require('dns');
const crypto = require('crypto');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());

// ======================================================
// MODELS
// ======================================================

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// ======================================================
// DATABASE CONNECTION
// ======================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ======================================================
// AUTH HELPERS
// ======================================================

// Verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Admin authorization
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

// ======================================================
// AUTH API
// ======================================================

// ------------------------------------------------------
// REGISTER
// ------------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Username, email and password are required'
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          'An account with that email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Public registration always creates customer
    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'customer'
    });

    // Create JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Remove password before returning user
    const userSafe = newUser.toObject();

    delete userSafe.password;

    res.json({
      success: true,
      user: userSafe,
      token
    });

  } catch (err) {
    console.error(
      'Registration error:',
      err
    );

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ------------------------------------------------------
// LOGIN
// ------------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Email and password are required'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    const userSafe = user.toObject();

    delete userSafe.password;

    res.json({
      success: true,
      token,
      user: userSafe
    });

  } catch (err) {
    console.error(
      'Login error:',
      err
    );

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ------------------------------------------------------
// FORGOT PASSWORD
// ------------------------------------------------------

app.post(
  '/api/auth/forgot-password',
  async (req, res) => {

    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const normalizedEmail =
        email.toLowerCase().trim();

      console.log(
        'Forgot password request:',
        normalizedEmail
      );

      // Find user
      const user = await User.findOne({
        email: normalizedEmail
      });

      /*
       * Don't reveal whether an account exists.
       */
      if (!user) {
        return res.json({
          success: true,
          message:
            'If an account exists with this email, a password reset link has been generated.'
        });
      }

      // Generate secure random token
      const resetToken =
        crypto.randomBytes(32).toString('hex');

      // Token expires in 15 minutes
      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpires =
        new Date(
          Date.now() + 15 * 60 * 1000
        );

      await user.save();

      // Local React URL
      const resetUrl =
        `http://localhost:5173/reset-password/${resetToken}`;

      // Development logging
      console.log('');
      console.log(
        '======================================'
      );
      console.log(
        '       PASSWORD RESET REQUEST'
      );
      console.log(
        '======================================'
      );
      console.log(
        `User: ${user.username}`
      );
      console.log(
        `Email: ${user.email}`
      );
      console.log(
        `Reset URL: ${resetUrl}`
      );
      console.log(
        'Expires in: 15 minutes'
      );
      console.log(
        '======================================'
      );
      console.log('');

      // Return response
      res.json({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been generated.',
        resetUrl
      });

    } catch (error) {

      console.error(
        'Forgot password error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Something went wrong. Please try again.'
      });
    }
  }
);

// ------------------------------------------------------
// RESET PASSWORD
// ------------------------------------------------------

app.post(
  '/api/auth/reset-password/:token',
  async (req, res) => {

    try {
      const { token } = req.params;

      const {
        password,
        confirmPassword
      } = req.body;

      // Validate password
      if (!password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            'Password and confirmation are required'
        });
      }

      // Check matching passwords
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            'Passwords do not match'
        });
      }

      // Minimum password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            'Password must be at least 6 characters'
        });
      }

      // Find valid reset token
      const user = await User.findOne({
        resetPasswordToken: token,

        resetPasswordExpires: {
          $gt: new Date()
        }
      });

      // Invalid or expired token
      if (!user) {
        return res.status(400).json({
          success: false,
          message:
            'Password reset link is invalid or has expired'
        });
      }

      // Hash new password
      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      // Update password
      user.password =
        hashedPassword;

      // Invalidate reset token
      user.resetPasswordToken = null;

      user.resetPasswordExpires = null;

      await user.save();

      console.log(
        `Password successfully reset for ${user.email}`
      );

      res.json({
        success: true,
        message:
          'Password has been reset successfully'
      });

    } catch (error) {

      console.error(
        'Reset password error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Something went wrong. Please try again.'
      });
    }
  }
);

// ------------------------------------------------------
// PROFILE
// ------------------------------------------------------

app.get(
  '/api/auth/profile',
  verifyToken,
  async (req, res) => {

    try {
      const user =
        await User.findById(
          req.user.id
        ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (err) {
      console.error(
        'Profile error:',
        err
      );

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// ======================================================
// PRODUCTS API
// ======================================================

app.get(
  '/api/products',
  async (req, res) => {

    try {
      const products =
        await Product.find();

      res.json({
        success: true,
        products
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Create product - Admin
app.post(
  '/api/products',
  verifyToken,
  requireAdmin,
  async (req, res) => {

    try {
      const product =
        await Product.create(
          req.body
        );

      res.json({
        success: true,
        product
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Update product - Admin
app.put(
  '/api/products/:id',
  verifyToken,
  requireAdmin,
  async (req, res) => {

    try {
      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            'Product not found'
        });
      }

      res.json({
        success: true,
        product
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Delete product - Admin
app.delete(
  '/api/products/:id',
  verifyToken,
  requireAdmin,
  async (req, res) => {

    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            'Product not found'
        });
      }

      res.json({
        success: true,
        message:
          'Product deleted'
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// ======================================================
// ORDERS API
// ======================================================

// Create order
app.post(
  '/api/orders',
  async (req, res) => {

    try {
      const order =
        await Order.create(
          req.body
        );

      res.json({
        success: true,
        order
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Get all orders - Admin
app.get(
  '/api/orders',
  verifyToken,
  requireAdmin,
  async (req, res) => {

    try {
      const orders =
        await Order.find()
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        orders
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Get current user's orders
app.get(
  '/api/orders/my',
  verifyToken,
  async (req, res) => {

    try {
      const orders =
        await Order.find({
          userId: req.user.id
        }).sort({
          createdAt: -1
        });

      res.json({
        success: true,
        orders
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Update order status - Admin
app.put(
  '/api/orders/:id/status',
  verifyToken,
  requireAdmin,
  async (req, res) => {

    try {
      const { status } = req.body;

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true
          }
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            'Order not found'
        });
      }

      res.json({
        success: true,
        order
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// Customer cancels own order
app.put(
  '/api/orders/:id/cancel',
  verifyToken,
  async (req, res) => {

    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            'Order not found'
        });
      }

      const isOwner =
        order.userId &&
        order.userId.toString() ===
          req.user.id;

      if (
        !isOwner &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message:
            'You can only cancel your own orders'
        });
      }

      if (
        order.status !== 'Pending'
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Order can't be cancelled once it's ${order.status}`
        });
      }

      order.status = 'Cancelled';

      await order.save();

      res.json({
        success: true,
        order
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
  }
);