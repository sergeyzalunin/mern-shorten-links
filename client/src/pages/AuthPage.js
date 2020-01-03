import React, {useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const AuthPage = () => {
    const message = useMessage()
    const {loading,  request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }  

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            console.log('data', data)
        } catch (e) {
           // console.log(e)
           // throw e
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Shorten the links</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                    <span className="card-title">Authoriztion</span>
                        <div>


                        <div className="input-field">
                            <input 
                                placeholder="Enter email" 
                                id="email" 
                                type="email" 
                                name="email"
                                className="yellow-input"
                                onChange={changeHandler}
                            />
                            <label htmlFor="email">Email</label>
                        </div>


                        <div className="input-field">
                            <input 
                                placeholder="Enter password" 
                                id="password" 
                                type="password" 
                                name="password" 
                                className="yellow-input"
                                onChange={changeHandler}
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                            className="btn yelllow darken-4" 
                            style={{ marginRight: 10 }}
                            disabled={loading}
                        >
                            Login
                        </button>
                        <button 
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}