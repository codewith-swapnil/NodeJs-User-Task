const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/task', taskRoutes);

sequelize.sync().then(() => {
    console.log('Database connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
});
