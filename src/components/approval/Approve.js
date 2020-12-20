import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { useToasts } from 'react-toast-notifications'

function Approve(props) {

    var eventContract = props.bc.contracts.event,
        accounts = props.bc.accounts[0];

    const history = useHistory()
    const { addToast } = useToasts()

    const [totalRequest, settotalRequest] = useState(0)
    const [requestId, setrequestId] = useState('')
    const [eventData, seteventData] = useState()
    const [gotData, setgotData] = useState(false)
    const [image, setimage] = useState('')
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        async function getTotal(){
            var result = await eventContract.methods.getTotalRequestsCount().call()
            return result
        }

        getTotal().then((n)=>{
            settotalRequest(n);
            var id = parseInt(props.match.params.requestId)
            setrequestId(id)
            if(!(id < n)){
                setTimeout(()=>{
                    history.push(`/viewRequests`);
                }, 6000)
            }
        })
    },[])

    const getEventData = () => {
        async function getData(){
            var result = await eventContract.methods.getRequest(props.match.params.requestId).call()
            return result
        }
        getData()
        .then(async (temp)=>{
            console.log("google")
            console.log(temp)
            seteventData(temp)
            if(gotData === false){
                setgotData(true)
                fetch(`http://localhost:8080/ipfs/${temp[1]}`)
                .then(res => res.json())
                .then((data) => {                   
                    var arrayBufferView = new Uint8Array( data["image"]["data"] );
                    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );
                    setimage(imageUrl)
                })
            }
        })
    }

    const approveHandle = () => {
        setisLoading(true)
        async function sendApprove(){
            var result = await eventContract.methods.approve(props.match.params.requestId).send({from: accounts})
            return result
        }

        sendApprove()
        .then(()=>{
            addToast('Request Created Successfully.', {
                appearance: 'success',
                autoDismiss: true,
            })
            setTimeout(()=>{
                history.push('/viewRequests')
            },1000)
        })
    }

    return (
        <div className='event' style={{textAlign:"center"}}>
            {(requestId < totalRequest) &&<> Photo Proof<br></br><img src={image} style={{height:"250px"}}></img></> }
            {(requestId < totalRequest) && image === "" && <Loader
                type="TailSpin"
                color="#8D3B72"
                height={50}
                width={50}
            />}
            <div className='form'>
                {!(requestId < totalRequest) ? <>
                        <div> Your Event Id is wrong. And this page does not not exists. Redirecting </div>
                        <Loader
                            type="TailSpin"
                            color="#8D3B72"
                            height={100}
                            width={100}
                        />
                </> 
                :
                <>
                    {getEventData()}
                    <h2>Request Details</h2>
                    <table style={{display: "table"}}>
                        <tbody>
                                <tr><td className="right bold">Aadhar Number :</td><td className="left">{eventData && eventData["0"]}</td></tr>
                        </tbody>
                    </table>
                    <hr></hr>
                        {eventData && eventData['2'] ? "" :
                        <button onClick={approveHandle}>
                            {!isLoading && "Approve"}
                            {isLoading &&<Loader
                                type="TailSpin"
                                color="white"
                                height={17}
                                width={17}
                            />}
                        </button>}
                </>
                }
            </div>
        </div>
    )
}

export default Approve
