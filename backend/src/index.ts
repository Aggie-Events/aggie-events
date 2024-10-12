import { testDB } from './database';
import {init} from './server';

init().then(app => {
  const PORT = process.env.PORT || 5000;
  testDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});



