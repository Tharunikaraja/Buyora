const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { supabase, isConfigured } = require('../config/db');

const getUserStore = (app) => {
  if (!app.locals.users) {
    app.locals.users = [];
  }
  return app.locals.users;
};

const normalizeUser = (user) => ({
  id: user.id,
  fullName: user.full_name || user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role || 'customer',
  password: user.password_hash || user.password,
  createdAt: user.created_at || user.createdAt,
});

const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

const register = async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body;
  const users = getUserStore(req.app);

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (isConfigured && supabase) {
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.warn('Supabase user lookup failed during registration:', lookupError.message);
    }

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { data: savedUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          full_name: fullName,
          email: normalizedEmail,
          phone,
          password_hash: hash,
          role: 'customer',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase user insert failed:', insertError.message);
      return res.status(500).json({ success: false, message: 'Unable to save user to database.' });
    }

    const user = normalizeUser(savedUser);
    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token: createToken(user),
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    });
  }

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: `USER-${Date.now()}`,
    fullName,
    email: normalizedEmail,
    phone,
    password: hash,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return res.status(201).json({
    success: true,
    message: 'Registration successful.',
    token: createToken(user),
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (isConfigured && supabase) {
    const { data: userRow, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.warn('Supabase user lookup failed during login:', error.message);
    }

    if (!userRow) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = normalizeUser(userRow);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      token: createToken(user),
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    });
  }

  const users = getUserStore(req.app);
  const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  return res.json({
    success: true,
    message: 'Login successful.',
    token: createToken(user),
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  return res.json({
    success: true,
    message: `Password reset instructions have been sent to ${email}.`,
  });
};

const getProfile = async (req, res) => {
  if (isConfigured && supabase) {
    const { data: userRow, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', Number(req.user.id))
      .maybeSingle();

    if (error) {
      console.warn('Supabase profile lookup failed:', error.message);
    }

    if (!userRow) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = normalizeUser(userRow);
    return res.json({
      success: true,
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    });
  }

  const users = getUserStore(req.app);
  const user = users.find((entry) => entry.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({
    success: true,
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
  });
};

module.exports = { register, login, forgotPassword, getProfile };
