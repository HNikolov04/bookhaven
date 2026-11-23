import { createBrowserRouter } from 'react-router'
import { LoginPage, RegisterPage } from '../features/auth/components/AuthPage'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { BookDetailsPage } from '../features/books/components/BookDetailsPage'
import { CatalogPage } from '../features/books/components/CatalogPage'
import { HomePage } from '../features/home/components/HomePage'
import { MyLibraryPage } from '../features/library/components/MyLibraryPage'
import { NotFoundPage } from '../shared/components/NotFoundPage'
import { MainLayout } from '../shared/layouts/MainLayout'

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: 'books',
            element: <CatalogPage />,
          },
          {
            path: 'books/:id',
            element: <BookDetailsPage />,
          },
          {
            path: 'my-library',
            element: <MyLibraryPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])
