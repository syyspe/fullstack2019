import React from 'react'

const RecommendedBooks = ({ show, books, user }) => {
    if (!show) {
      return null
    }
  
    if (books.loading || user.loading) {
      return (<div>loading...</div>)
    }

    if (!user.data.me) {
      return (<div>No user information at this point {user.data.toString()}</div>)
    }

    return (
      <div>
        <h2>Recommendations based on your favorite genre '{user.data.me.favoritegenre}'</h2>
        <table>
          <thead>
            <tr>
              <th>
                title
              </th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
          </thead>
          <tbody>
            {books.data.allBooks.map(b => {
              if (user.data.me.favoritegenre && !b.genres.includes(user.data.me.favoritegenre)) {
                return null
              } 
              return (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published ? b.published : ''}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default RecommendedBooks