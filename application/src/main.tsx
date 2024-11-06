// -
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store.ts';
import App from './App.tsx'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <Provider store={store}>
  //    <App />
  //   </Provider>
  // </StrictMode>,
  <Provider store={store}>
     <App />
    </Provider>,
)