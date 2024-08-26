import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import Home from './components/Home'
import About from './components/About.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
       {
        element: <Home />,
        index: true
       },
       {
        path: '/about',
        element: <About />
       }
    ]
  }
]


const router = createBrowserRouter(routes)
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />

)
