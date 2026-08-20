const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const savedMessages = [];

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Portfolio API is running' });
});

app.get('/api/messages', (req, res) => {
  res.json({ count: savedMessages.length, messages: savedMessages });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.'
    });
  }

  const entry = {
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString()
  };

  savedMessages.push(entry);

  console.log('New portfolio message received:', entry);

  return res.json({
    success: true,
    message: 'Your message was received successfully. I will get back to you soon.'
  });
});

app.use(express.static(__dirname));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
