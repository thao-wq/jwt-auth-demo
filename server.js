require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const helloRoutes = require('./routes/helloRoutes');

const app = express();

app.use(express.json());

app.use('/', authRoutes);
app.use('/', helloRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
});