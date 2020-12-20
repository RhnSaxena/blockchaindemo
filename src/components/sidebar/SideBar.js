import React from 'react'
import { NavLink } from "react-router-dom";
  
import './SideBar.css'

function SideBar(props) {
    const handleClickOnLink = () => {
        console.log("Link clicked")
        props.toggleMenu();
    }

    return (
        <div className='sideBar'>
            <ul className='sideBar-ul'>
                <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/events">Find Events</NavLink></li>
                <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/create-event">Create Events</NavLink></li>
                <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/my-events">My Events</NavLink></li>
                <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/my-tickets">My Tickets</NavLink></li>
                {!props.isOwner && <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/getApproval">Get Approval</NavLink></li>}
                {props.isOwner && <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/ViewRequests">View Requests</NavLink></li>}
                <li><NavLink activeClassName='activePath' onClick={handleClickOnLink} to="/verify">Verify</NavLink></li>
            </ul>
        </div>
    )
}

export default SideBar
