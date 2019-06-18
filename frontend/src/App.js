import React, { useState } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import Notification from './components/Notification'
import Authors from './components/Authors'
import Books from './components/Books'
import RecommendedBooks from './components/RecommendedBooks'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { ALL_BOOKS, ALL_AUTHORS, ME } from './graphql/queries'
import { ADD_BOOK, EDIT_AUTHOR, LOGIN } from './graphql/mutations'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-app-token'))
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState(null)

  const client = useApolloClient()

  const notify = (msg, timeout=10000) => {
    setMessage(msg ? msg.toString() : null)
    setTimeout(
      () => {
        setMessage(null)
      },
      timeout
    )
  }

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const me = useQuery(ME)
  const addBook = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })
  const editAuthor = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const login = useMutation(LOGIN, {
    update: (store, result) => {
      localStorage.setItem('book-app-token', result.data.login.value)
    },
    refetchQueries: [{ query: ME }]
  })

  const logout = () => {
    setToken(null)
    client.resetStore()
    localStorage.clear()
    setPage('authors')
  }

  if (token && page === 'login') {
    setPage('authors')
  }

  return (
    <div>
      <button onClick={() => setPage('authors')}>Authors</button>
      <button onClick={() => setPage('books')}>Books</button>
      {token ?
        <span> 
          <button onClick={() => setPage('newbook')}>New book</button>
          <button onClick={() => setPage('recommended')}>Recommended</button>
          <button onClick={logout}>Logout {me.data && me.data.me ? me.data.me.username : ''}</button>
        </span>
        :
        <button onClick={() => setPage('login')}>Login</button>
      }

      <Notification
        show={message}
      />
      
      <Authors
        show={page === 'authors'}
        authors={authors}
        editAuthor={editAuthor}
        handleError={notify}
      />

      <Books
        show={page === 'books'}
        books={books}
      />

      <NewBook
        show={page === 'newbook'}
        addBook={addBook} 
        handleError={notify}
      />

      <RecommendedBooks
        show={page === 'recommended'}
        books={books}
        user={me}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        setToken={setToken}
        handleError={notify}
      />
    </div>
  )

}

export default App
