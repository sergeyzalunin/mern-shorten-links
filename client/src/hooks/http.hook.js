import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method='GET', body=null, headers={}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                console.log('BODY: ', body)
                headers['Content-Type'] = 'application/json'
            }

            console.log('class: ', { method, body, headers })
            const response = await fetch(url, { method, body, headers }) 
            console.log('response: ', response)
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError }
}