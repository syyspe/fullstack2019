import React, { useState } from 'react'

const Authors = ({ show, authors, editAuthor, handleError }) => {
  const [birthyear, setBirthyear] = useState(null)
  const [name, setName] = useState('')

  if (!show) {
    return null
  }

  if (authors.loading) {
    return (<div>loading...</div>)
  }

  if (!authors.data.allAuthors) {
    return (<div><h3>No authors at this time</h3></div>)
  }

  const setBirthYearWrapper = (value) => {
    const birthyearAsInt = Number(value)
    if (isNaN(birthyearAsInt)) {
      setBirthyear(null)
      return
    }
    setBirthyear(birthyearAsInt)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !name.length) {
      handleError('Please select the author from the list before submitting')
      return
    }
    try {
      await editAuthor({
        variables: {
          name,
          born: birthyear
        }
      })
     } catch(err) {
      handleError(err)
    }
    setBirthyear(null)

  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>
              name
            </th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1
            }
            if (b.name.toLowerCase() < a.name.toLowerCase()) {
              return 1
            }
            return 0
          }).map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {localStorage.getItem('book-app-token') ?
      <div>
        <h2>Set birthyear</h2>
        <select defaultValue={'DEFAULT'} onChange={({ target }) => setName(target.value)}>
          <option value="DEFAULT" disabled>Choose author ...</option>
          {authors.data.allAuthors.map(a =>
            <option key={a.name} value={a.name}>{a.name}</option>
          )}
        </select>
        <form onSubmit={submit}>
          <input type='number' onChange={({ target }) => setBirthYearWrapper(target.value)} />
          <button type='submit'>Update author</button>
        </form>
      </div>
      : null }
    </div>
  )
}

export default Authors