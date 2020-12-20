import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../../OIP.png'

function ViewRequests(props) {

    var eventContract = props.bc.contracts.event;
    
    const [allData, setallData] = useState([])

    useEffect(() => {
        async function getTotal(){
            var result = await eventContract.methods.getTotalRequestsCount().call()
            return result
        }

        async function getData(id){
            var result = await eventContract.methods.getRequest(parseInt(id)).call()
            setallData(prevData => [...prevData, result])
            return result
        }

        getTotal().then((n)=>{
            console.log(n)
            for(var i=0; i<n; i++){
                getData(i)
            }
        })
    },[])

    return (
        <div className='event'>
            <h2 style={{textAlign:"center"}}>Pending Requests</h2>
            <div>
                <ul className="ul">
                    {allData.map((ele, index)=>{
                        return (
                            !ele[2] && <li key={index} className="li">
                            <img alt="event img" src={logo} className="img" style={{width: '150px'}}>
                            </img>
                            <div>
                               Aadhar Number: <br></br>{ele[0]}
                            </div>
                            {ele[2] ? "" : 
                            <div className="form">
                                <NavLink to={`/approve/${index}`}>
                                    <button>Approve</button>
                                </NavLink>
                            </div>}
                        </li>)
                    })}
                </ul>
            </div>

            <h2 style={{textAlign:"center"}}>Approved Requests</h2>
            <div>
                <ul className="ul">
                    {allData.map((ele, index)=>{
                        return (
                            ele[2] && <li key={index} className="li old">
                            <img alt="event img" src={logo} className="img" style={{width: '150px'}}>
                            </img>
                            <div>
                               Aadhar Number: <br></br>{ele[0]}
                            </div>
                            {ele[2] ? "" : 
                            <div className="form">
                                <NavLink to={`/approve/${index}`}>
                                    <button>Approve</button>
                                </NavLink>
                            </div>}
                        </li>)
                    })}
                </ul>
            </div>
        </div>
    )
}

export default ViewRequests
