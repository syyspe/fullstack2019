import { gql } from 'apollo-boost'

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            published
            author {
                name
                born
                bookCount
            }
            genres
        }
    }
`