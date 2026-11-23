import { createBrowserRouter } from 'react-router'
import { LoginPage, RegisterPage } from '../features/auth/AuthPage'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { BookDetailsPage } from '../features/books/BookDetailsPage'
import { CatalogPage } from '../features/books/CatalogPage'
import { HomePage } from '../features/home/HomePage'
import { MyLibraryPage } from '../features/library/MyLibraryPage'
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
