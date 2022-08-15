import React from 'react';
import './Navbar.scss';

const Navbar = () => {
    const [name, setName] = React.useState('')

    React.useEffect(() => {
        const token = sessionStorage.getItem('token_notion')
        if (token) {
            const owner = JSON.parse(sessionStorage.getItem('owner'))
            setName(owner.user.name.split(' ')[0])
        }
    }, [])
    return (
        <div id='nav'>
            <div className="name">{name}</div>
        </div>
    )
}

export default Navbar