import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Root } from './layout/Root'
import { Auth } from './layout/Auth'
import { Loading } from './components/Loading'
import Fetch from './middlewares/fetch'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home'
import { Login } from './pages/Login'
import { Error } from './pages/Error'
import {
  getAdminError,
  getAdminPending,
  getAdminSuccess
} from './toolkit/AdminSlicer'
import { ViewMap } from './pages/map'
import { News } from './pages/news'

export default function App () {
  const { isAuth, isPending } = useSelector(state => state.admin)
  const [_, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const getMyData = async () => {
      try {
        dispatch(getAdminPending())
        const response = await Fetch.get('admin/me')
        if (response.data) {
          dispatch(getAdminSuccess(response.data.data))
        } else {
          dispatch(getAdminError('No Admin data available'))
        }
      } catch (error) {
        dispatch(getAdminError(error.response?.data || 'Unknown Token'))
      } finally {
        setIsLoading(false)
      }
    }

    getMyData()
  }, [dispatch])

  if (isPending) {
    return <Loading />
  }
  const router = createBrowserRouter([
    isAuth
      ? {
          path: '/',
          element: <Root />,
          children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'locations', element: <ViewMap /> },
            { path: 'news', element: <News /> },
            { path: '*', element: <Error /> }
          ]
        }
      : {
          path: '/',
          element: <Auth />,
          children: [
            { index: true, element: <Login /> },
            { path: '*', element: <Login /> }
          ]
        }
  ])

  return <RouterProvider router={router} />
}
