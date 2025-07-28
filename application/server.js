import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const initializeApp = async () => {
  await connectDB();
};

initializeApp().then(() => {

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running locally on port: ${PORT}`);
    });
  }
});

export default app;