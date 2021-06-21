const express = require('express');
const cookieParser = require('cookie-parser');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');

const app = express();

app.use(express.json({
    limit: '10kb'
}));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);

module.exports = app;