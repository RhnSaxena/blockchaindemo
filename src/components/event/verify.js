import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import success from '../../animation.gif'
import sha256 from 'sha256'

function Verify(props) {

    var eventContract = props.bc.contracts.event,
    accounts = props.bc.accounts[0];

    const [tid, settid] = useState('');
    const [eid, seteid] = useState('');
    const [sid, setsid] = useState('');
    const [qr, setqr] = useState('');
    const [aadhar, setaadhar] = useState('')
    const [isValid, setisValid] = useState(false)

    const { addToast } = useToasts()

    const handletid = (e) => {
        settid(e.target.value)
    }

    const handleeid = (e) => {
        seteid(e.target.value)
    }

    const handlesid = (e) => {
        setsid(e.target.value)
    }

    const handleqr = (e) => {
        setqr(e.target.value)
    }

    const handleAadhar = (e) => {
        setaadhar(e.target.value)
    }

    const NoEventExists = () => {
        addToast('No such Ticket Exists.', {
            appearance: 'warning',
            autoDismiss: true,
        })
    }

    const verifyTicket = async () => {
        if(tid == '' || sid == '' || eid == '' || qr == ''){
            addToast('Enter all details.', {
                appearance: 'warning',
                autoDismiss: true,
            })
        }else{
            var ticket = '',address = ''
            try {
                ticket = await eventContract.methods.getTicket(parseInt(tid)).call()
                if(parseInt(eid) != parseInt(ticket[0]) || parseInt(sid) != parseInt(ticket[1])){
                    NoEventExists();
                }
            } catch (error) {
                NoEventExists()
            }
            try {
                address = await eventContract.methods.getAddress(aadhar).call()
            } catch (error) {
                NoEventExists()
            }
            var str = "" + tid + eid + sid + address
            var _shacode = sha256(str)
            console.log(qr, _shacode)
            if(qr == _shacode){
                addToast('Valid Ticket.', {
                    appearance: 'success',
                    autoDismiss: true,
                })
                setisValid(true)
            }else{
                NoEventExists()
            }
        }
    }

    const initiate = () => {
        settid('')
        setsid('')
        seteid('')
        setqr('')
        setaadhar('')
        setisValid(false)
    }

    return (
        <div className='event'>
            {!isValid && <div className="form">
                <h2>
                    Verify
                </h2>
                <input
                    type="text"
                    className="form-field animation a3"
                    placeholder="Ticket Id"
                    value={tid}
                    onChange={handletid}
                    maxLength='50'
                />

                <input
                    type="text"
                    className="form-field animation a3"
                    placeholder="Event Id"
                    value={eid}
                    onChange={handleeid}
                    maxLength='50'
                />

                <input
                    type="text"
                    className="form-field animation a3"
                    placeholder="Seat Id"
                    value={sid}
                    onChange={handlesid}
                    maxLength='50'
                />

                <input
                    type="text"
                    className="form-field animation a3"
                    placeholder="QR Code / SHA Code"
                    value={qr}
                    onChange={handleqr}
                    maxLength='100'
                />

                <input
                    type="text"
                    className="form-field animation a3"
                    placeholder="Aadhar Number"
                    value={aadhar}
                    onChange={handleAadhar}
                    maxLength='50'
                />

                <button
                    className="animation a6"
                    onClick={verifyTicket}>Verify Ticket</button>

            </div>}
            {isValid && <div className="form">
                <img alt="event img" src={success} className="img"></img>
                <button onClick={initiate}>Verify Other Ticket</button>
                </div>}

        </div>
    )
}

export default Verify
