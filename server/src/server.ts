import app from './app.js';

const PORT = process.env.PORT || 4000;

const startServer = () => {
  app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
};

startServer();
