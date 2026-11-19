import { createBrowserRouter } from 'react-router'
import { HomePage } from '../features/home/HomePage'
import { MainLayout } from '../shared/layouts/MainLayout'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'books',
        lazy: async () => {
          const { CatalogPage } = await import('../features/books/CatalogPage')
          return { Component: CatalogPage }
        },
      },
      {
        path: 'books/:id',
        lazy: async () => {
          const { BookDetailsPage } = await import('../features/books/BookDetailsPage')
          return { Component: BookDetailsPage }
        },
      },
      {
        path: 'my-library',
        lazy: async () => {
          const { MyLibraryPage } = await import('../features/library/MyLibraryPage')
          return { Component: MyLibraryPage }
        },
      },
      {
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('../features/auth/AuthPage')
          return { Component: LoginPage }
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { RegisterPage } = await import('../features/auth/AuthPage')
          return { Component: RegisterPage }
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('../shared/components/NotFoundPage')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
