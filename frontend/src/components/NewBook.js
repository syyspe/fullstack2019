import React, { useState } from 'react'

const NewBook = ({ show, addBook, handleError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('') // fixed typo setAuhtor -> setAuthor
  const [published, setPublished] = useState(null)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    const publishedAsInt = Number(published)
    if (isNaN(publishedAsInt)) {
      setPublished(null)
      return
    }
    try {
      await addBook({
        variables: {
          title,
          published: publishedAsInt,
          author,
          genres
        }
      })
    } catch (err) {
      handleError(err)
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            minLength={1}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            minLength={1}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published ? published : ''}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook