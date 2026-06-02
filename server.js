const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;

// Serve all static files from this directory
app.use(express.static(path.join(__dirname)));

// Fallback — serve index.html for any unknown route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`PDN Frontend running on port ${PORT}`));
