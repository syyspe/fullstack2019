import React, {useState} from 'react'

const LoginForm = ({ show, login, setToken, handleError }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (!show) {
        return null
    }

    const submit = async (e) => {
        e.preventDefault()
        try {
            const result = await login({ variables: {username, password } })
            const token = result.data.login.value
            localStorage.setItem('book-app-token', token)
            setToken(token)
        } catch(err) {
            handleError(err)
        }
        
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    Username: <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    Password: <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginForm