import React, { useState } from 'react'


const Books = ({ show, books }) => {
  const [genres, setGenres] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)

  if (!show) {
    return null
  }

  if (books.loading) {
    return (<div>loading...</div>)
  }

  if (!books.data.allBooks) {
    return (
      <h3>No books at this time</h3>

    )
  }

  books.data.allBooks.forEach(b => {
    b.genres.forEach(bg => {
      if (!genres.includes(bg)) {
        setGenres(genres.concat(bg))
      }
    })
  })

  return (
    <div>
      <h2>books</h2>
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
            if (activeGenre && !b.genres.includes(activeGenre)) {
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
      <div>
        {genres.map(b => 
          <button key={b} onClick={() => setActiveGenre(b)}>{b}</button>   
        )}
        {genres ? <button onClick={() => setActiveGenre(null)}>All genres</button> : null}
      </div>
    </div>
  )
}

export default Books