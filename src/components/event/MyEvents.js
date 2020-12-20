import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../../logo.png'

function MyEvents(props) {

    var eventContract = props.bc.contracts.event;
    var account = props.bc.accounts[0]
    const [allData, setallData] = useState([])
    useEffect(() => {
        async function getEvents(){
            var result = await eventContract.methods.eventsOf(account).call()
            return result
        }

        async function getData(id){
            var result = await eventContract.methods.getEvent(parseInt(id)).call()
            setallData(prevData => [...prevData, result])
            return result
        }

        getEvents().then((data)=>{
            for(var i of data){
                getData(i)
            }
        })
    },[])

    const getLocaleTime = (time) => {
        var utcSeconds = parseInt(time);
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        return d.toLocaleString()
    }

    const isOld = (time) => {
        var utcSeconds = parseInt(time);
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        var sec = (new Date()).getTime()
        // console.log(sec, d.getTime())
        return sec >= d.getTime()
    }

    return (
        <div className='event'>
            <h2 style={{textAlign:"center"}}>My Events</h2>
            <div>
                <ul className="ul">
                    {allData.map((ele, index)=>{
                        return (
                        <li key={index} className={isOld(ele["time"]) ? "li old" : "li"}>
                            <img alt="event img" src={logo} className="img">
                            </img>
                            <h2 style={{fontWeight:"400"}}>
                                {ele["name"]}
                            </h2>
                            <div style={{margin:'5px'}}>
                                {getLocaleTime(ele["time"])}
                            </div>
                            <div>
                                {ele["limited"] && <>Limited Seats - { ele["seats"] - ele["sold"]} Available</>}
                                {!ele["limited"] && <>Unlimited Seats</>}
                            </div>
                            {isOld(ele["time"]) ? "" : 
                            <div className="form">
                                <NavLink to={`/event/${index}`}>
                                    <button>Buy Ticket</button>
                                </NavLink>
                            </div>}
                        </li>)
                    })}
                </ul>
            </div>
        </div>
    )
}

export default MyEvents
