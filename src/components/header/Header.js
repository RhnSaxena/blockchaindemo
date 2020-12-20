import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import './Header.css'

function Header(props) {
    const [open, setopen] = useState(props.open)
    useEffect(() => {setopen(props.open) }, [props.open]);

    const handleMenuClick = () => {
        props.toggleMenu()
    }

    return (
        <div className='header'>
            <div className='header-name' key={toString(open)}>
                {open ?
                <span className='menu-icon' onClick={handleMenuClick}> &#10008;</span>
                :<span className='menu-icon' onClick={handleMenuClick}> &#9776;</span>
                }
                <Link to='/'> CryptoTicketing <span role="img" aria-label="ticket">🎫</span></Link>
            </div> 
        </div>
    )
}

export default Header
