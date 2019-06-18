const connect = require('./database/mongo')
const { ApolloServer, UserInputError, AuthenticationError, gql, PubSub } = require('apollo-server')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

connect()
const pubsub = new PubSub()

const typeDefs = gql`
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
} 
type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
}
type User {
    username: String!
    favoritegenre: String!
    id: ID!
} 
type Token {
    value: String!
    id: ID!
}  
type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
}
type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int
        genres: [String!]
    ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoritegenre: String!
    ): User
    editUser(
        favoritegenre: String
    ): User
    login(
        username: String!
        password: String!
    ): Token
}
type Subscription {
    bookAdded: Book!
}
`

const resolvers = {
    Mutation: {
        editAuthor: async (root, args, { currentUser }) => {
            console.log('editAuthor')
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            if(!args.name) {
                throw new UserInputError('Author name is mandatory parameter', {
                    invalidArgs: args.name
                })
            }
            if(!args.setBornTo) {
                throw new UserInputError('Author birth year is mandatory parameter', {
                    invalidArgs: args.setBornTo
                })
            }
            const author = await Author.findOne({ name: args.name })
            if(!author) {
                return null
            }

            author.born = args.setBornTo
            await author.save()
            return author
        },
        addBook: async (root, args, { currentUser }) => {
            console.log('addBook')
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            if (!args.title) {
                throw new UserInputError('Book title is mandatory parameter', {
                    invalidArgs: args.title
                })
            }
            if(!args.author) {
                throw new UserInputError('Book author is mandatory parameter', {
                    invalidArgs: args.author
                })
            }
            let newAuthor = await Author.findOne({ name: args.author })
            if (!newAuthor) {
                newAuthor = new Author({
                    name: args.author
                })
                await newAuthor.save()
            }
            const newBook = new Book({ ...args, author: newAuthor })
            pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
            return newBook.save()

        },
        createUser: async (root, args) => {
            console.log('createUser')
            user = User({username: args.username, favoritegenre: args.favoritegenre})
            try {
                user = User({username: args.username, favoritegenre: args.favoritegenre})
                await user.save()
            } catch(err) {
                throw new UserInputError(err.message, { invalidArgs: args })
            }
            return user
        },
        editUser: async (root, args, { currentUser }) => {
            console.log('editUser')
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            try {
                const user = await User.findOne({ username: currentUser.username })
                user.favoritegenre = args.favoritegenre
                user.save()
                return user
            } catch(err) {
                throw new UserInputError(err.message, {invalidArgs: args })
            }
        },
        login: async (root, args) => {
            console.log('login')
            const user = await User.findOne({ username: args.username })
            if (!user || args.password != 'supersecret') {
                throw new UserInputError('invalid username or password')
            }
            const userForToken = {
                username: user.username,
                favoritegenre: user.favoritegenre
            }
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    },
    Query: {
        bookCount:() => {
            console.log('bookCount')
            Book.collection.countDocuments()
        }, 
        authorCount: () => {
            console.log('authorCount')
            Author.collection.countDocuments()
        },
        allBooks: async (root, args) => {
            console.log('allBooks')
            const all = await Book.find({})
            for (let i = 0; i < all.length; i++) {
                await all[i].populate('author').execPopulate()
            }
            if (args.author && args.genre) {
                return all.filter(b => b.author.name === args.author).filter(b => b.genres.includes(args.genre))
            }
            else if (args.author) {
                const selected = all.filter(b => b.author.name === args.author)
                return selected
            }
            else if (args.genre) {
                return all.filter(b => b.genres.includes(args.genre))
            }
            return all
        },
        allAuthors: async () => { 
            console.log('allAuthors')
            return Author.find({})
            
        },
        me: (root, args, { currentUser }) => {
            console.log('me')
            return currentUser
        }
    },
    Book: {
        title: (root) => root.title,
        published: (root) => root.published,
        author: (root) => root.author,
        genres: (root) => root.genres
    },
    Author: {
        name: (root) => root.name,
        born: (root) => root.born,
        bookCount: async (root) => {
            const books = await Book.find({})
            for (let i = 0; i < books.length; i++) {
                await books[i].populate('author').execPopulate()
            }
            return books.filter(b => b.author.name === root.name).length
        }
    },
    User: {
        username: (root) => root.username,
        favoritegenre: (root) => root.favoritegenre
    },
    Token: {
        value: (root) => root.value
    },
    Subscription: {
        bookAdded: {
            subscribe: () => { 
                console.log('someone subscribed to BOOK_ADDED')
                return pubsub.asyncIterator(['BOOK_ADDED'])
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null    
        if (auth && auth.toLowerCase().startsWith('bearer ')) {      
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)      
            const currentUser = await User.findOne({ username: decodedToken.username })      
            return { currentUser }
        }
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}, subscriptions: ${subscriptionsUrl}`)
})