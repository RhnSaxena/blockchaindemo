import React, { useState, useEffect } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useToasts } from 'react-toast-notifications'
import logo from '../../ticketlogo.jpg'
import qrlogo from '../../ticketlogo.png'
import copylogo from '../../copy.png'
import sha256 from 'sha256'
import QRCode from "react-qr-code";
import domtoimage from 'dom-to-image';
import Modal from 'react-modal';

function MyTickets(props) {
    
    var subtitle;
    var eventContract = props.bc.contracts.event;
    var account = props.bc.accounts[0]

    const { addToast } = useToasts()
    const [allData, setallData] = useState([])
    const [QR, setQR] = useState('')
    const [eid, seteid] = useState('')
    const [sid, setsid] = useState('')
    const [shaCode, setshaCode] = useState('')
    const [modalIsOpen,setIsOpen] = React.useState(false);

    const customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
        }
    };

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    function closeModal(){
        setIsOpen(false);
    }

    useEffect(() => {
        async function getEvents(){
            var result = await eventContract.methods.ticketsOf(account).call()
            return result
        }

        async function getData(id){
            var result = await eventContract.methods.getTicket(parseInt(id)).call()
            setallData(prevData => [...prevData, result])
            return result
        }

        getEvents().then((data)=>{
            for(var i of data){
                getData(i)
            }
        })
    },[])

    const isOld = (time) => {
        var utcSeconds = parseInt(time);
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        var sec = (new Date()).getTime()
        // console.log(sec, d.getTime())
        return sec >= d.getTime()
    }

    const generateHash = (event) => {
        var index = event.target.getAttribute('data-id')
        console.log(event.target.getAttribute('data-id'))
        console.log(allData[index])
        var str = "" + index + allData[index][0] + allData[index][1] + account
        var _shacode = sha256(str)
        setQR(_shacode);
        setshaCode(_shacode);
        seteid(allData[index][0])
        setsid(allData[index][1])
        openModal();
    }

    const DownloadQR = () => {
        domtoimage.toJpeg(document.getElementById('QR'), { quality: 0.95 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = dataUrl;
            link.click();
        });
    }

    const clickToCopy = () => {
        addToast('Sha Code Copied.', {
            appearance: 'success',
            autoDismiss: true,
        })
    }

    return (
        <div className='event'>
            <h2 style={{textAlign:"center"}}>My Tickets</h2>
            <div>
                <ul className="ul">
                    {allData.map((ele, index)=>{
                        return (
                        <li key={index} className={isOld(ele["time"]) ? "li old" : "li"}>
                            <img alt="event img" src={logo} className="img">
                            </img>
                            <div style={{margin:'5px 0 0 0'}}>
                                {ele[0] && <>Event Id - {ele["0"]}</>}
                                <br></br>
                                {ele[1] && <>Seat Id - {ele["1"]}</>}
                                <br></br>
                                {<>Ticket Id - {index}</>}
                            </div>
                            {isOld(ele["time"]) ? "" : 
                            <div className="form">
                                    <button data-id={index} onClick={generateHash}>Generate QR</button>
                            </div>}
                        </li>)
                    })}
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        ariaHideApp={false}
                        style={customStyles}
                        contentLabel="Example Modal">
                
                        <h2 ref={_subtitle => (subtitle = _subtitle)}>Your ticket</h2>
                        <button onClick={DownloadQR}>Download</button>
                        <button onClick={closeModal}>close</button>
                        {QR && <div id="QR"><img src={qrlogo}></img ><QRCode value={QR} />
                        <br></br>
                        <div style={{'display': 'flex','flexDirection': 'row'}}>
                            <div id="shaCode" style={{'width': '250px','overflowWrap': 'break-word'}}>
                                {shaCode}
                                
                            </div>
                            <div style={{'display': 'block','margin': 'auto','cursor':'pointer'}}>
                                <CopyToClipboard text={shaCode} onCopy={clickToCopy}>
                                    <img src={copylogo} style={{'width': '20px','height': 'auto'}} ></img >
                                </CopyToClipboard>
                            </div>
                        </div>
                        <br></br>
                        <div> Event ID-{eid} Seat ID-{sid}</div></div>}
                    </Modal>
                </ul>
            </div>
        </div>
    )
}

export default MyTickets
