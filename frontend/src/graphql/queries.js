import { gql } from 'apollo-boost'

export const ALL_BOOKS = gql`
{
  allBooks  {
    title
    author {
        name
        bookCount
    }
    published
    genres
  }
}
`
export const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`
export const ME = gql`
{
  me {
    username
    favoritegenre
  }
}
`