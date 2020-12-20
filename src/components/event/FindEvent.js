import React, { useState, useEffect } from 'react'
import { useHistory, NavLink } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import logo from '../../logo.png'

function FindEvent(props) {
    var eventContract = props.bc.contracts.event;
    
    const [totalEvent, settotalEvent] = useState(0)
    const [eventId, seteventId] = useState('')
    const [allData, setallData] = useState([])
    const { addToast } = useToasts()
    const history = useHistory()
    var current = 0;

    useEffect(() => {
        async function getEvents(){
            var result = await eventContract.methods.getEventsCount().call()
            return result
        }
        getEvents().then((events)=>{
            settotalEvent(events)
            getData(Math.min(events, 5))
        })
    },[])

    const handleFindEvent = () => {
        if(parseInt(eventId) >= parseInt(totalEvent)){
            addToast('No such event Exists.', {
                appearance: 'warning',
                autoDismiss: true,
            })
        }else{
            if(eventId === ""){
                addToast('Enter Event Id.', {
                    appearance: 'warning',
                    autoDismiss: true,
                })
            }else{
                history.push(`/event/${eventId}`);
            }
        }
    }

    const getLocaleTime = (time) => {
        var utcSeconds = parseInt(time);
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        return d.toLocaleString()
    }

    const getData = (n) => {
        async function getData(id){
            var result = await eventContract.methods.getEvent(parseInt(id)).call()
            setallData(prevData => [...prevData, result])
            return result
        }

        for(; current<n; current++){
            getData(current)
        }
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
            <div className='form'>
                Total Events Available : {totalEvent}
                <h2>Find Events by Id</h2>
                <input
                    type="number"
                    className="form-field animation a3"
                    placeholder="Event Id"
                    value={eventId}
                    onChange={(e)=>{seteventId(e.target.value)}}
                    maxLength='50'
                />

                {/* <NavLink to={`/event/${eventId}`} style={{color:"white", textDecoration:'none'}}> */}
                    <button
                    onClick={handleFindEvent}
                        >Find By Id
                    </button>
                {/* </NavLink> */}
            </div>
            <div>
                <ul className="ul">
                    {allData.map((ele, index)=>{
                        return (
                        <li key={index} className={isOld(ele["time"]) ? "li old" : "li"}>
                            <img alt="event img" src={logo} className="img" style={{height:'100px'}}>
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

export default FindEvent
