import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@store/index' // Подключаем наш стор через элиас
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Оборачиваем всё приложение в Provider и передаем наш store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
