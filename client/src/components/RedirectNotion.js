import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const RedirectNotion = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code')

    const getAuthToken = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/oauth/notion?code=${code}`)
            console.log(response);
            if (response.data.token) {
                sessionStorage.setItem('token_notion', response.data.token);
                sessionStorage.setItem('owner', JSON.stringify(response.data.owner));
            }
            window.location.href = '/';
        }
        catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getAuthToken();
    }, [code]);

    return (
        <div>Redirecting...</div>
    )
}

export default RedirectNotion