import React from 'react'
import {
    Switch,
    Route,
} from "react-router-dom";
import MyEvent from '../event/MyEvents'
import Ticket from '../event/MyTickets'
import CreateEvent from '../event/CreateEvent'
import FindEvent from '../event/FindEvent'
import Event from '../event/Event'
import Approval from '../approval/approval'
import Approve from '../approval/Approve'
import ViewRequests from '../approval/viewRequests'
import Verify from '../event/verify'

import './MainContent.css'

function MainContent(props) {
    return (
        <div className='mainContent'>
            <Switch>
                <Route exact path='/'>
                    <div className='welcome'>Welcome To CryptoTicketing BlockChain Network <br/> 🎟️</div>
                </Route>
                <Route path='/my-events' component={(prop)=><MyEvent {...prop} {...props} />} />
                <Route path='/my-tickets' component={(prop)=><Ticket {...prop} {...props} />} />
                <Route path='/events' component={(prop)=> <FindEvent {...prop} {...props} />} />
                <Route path="/event/:EventId" component={(prop)=> <Event {...prop} {...props} />} />
                <Route path='/create-event' component={(prop)=><CreateEvent {...prop} {...props}/>} />
                <Route path='/getApproval' component={(prop)=><Approval {...prop} {...props}/>} />
                <Route path='/viewRequests' component={(prop)=><ViewRequests {...prop} {...props}/>} />
                <Route path='/approve/:requestId' component={(prop)=><Approve {...prop} {...props}/>} />
                <Route path='/verify' component={(prop)=><Verify {...prop} {...props}/>} />
            </Switch>
        </div>
    )
}

export default MainContent
