import React, { useState } from 'react'
import Loader from 'react-loader-spinner'
import IpfsHttpClient from 'ipfs-http-client';
import { useToasts } from 'react-toast-notifications'


function Approval(props) {

    var eventContract = props.bc.contracts.event,
    accounts = props.bc.accounts[0];

    const [aadhar, setaadhar] = useState('')
    const [file, setfile] = useState(null)
    const [buffer, setbuffer] = useState('')
    const [isLoading, setisLoading] = useState(false)

    const ipfs = IpfsHttpClient({ host: 'localhost', port: '5001', protocol: 'http' })
    const { addToast } = useToasts()

    const convertToBuffer = async(reader) => {
        //file is converted to a buffer for upload to IPFS
        const bufferLocal = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        setbuffer(bufferLocal);
    }

    const handleFileChange = (event) => {
        // setfile(e.target.files[0])
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => convertToBuffer(reader)    
    };

    const initializeState = () => {
        setaadhar('');
        setfile(null);
        setbuffer('')
        setisLoading(false);
    }

    const handleSubmit = async () => {
        if(aadhar === "" || buffer === ''){
            addToast('Please Enter all details.', {
                appearance: 'warning',
                autoDismiss: true,
            })
            return
        }else{
            setisLoading(true)
        }

        let data = JSON.stringify({
			image: buffer
		});

        var result = await ipfs.add(data)

        await eventContract.methods
            .requestApproval( aadhar ,result["path"])
            .send({from: accounts})
        initializeState()
        setisLoading(false)
        addToast('Request Created Successfully.', {
            appearance: 'success',
            autoDismiss: true,
        })
    }

    return (
        <div className="event">
            {!isLoading&&<div className="form">
                <h2>Request a Approval</h2>

                <input
                    type="number"
                    className="form-field animation a3"
                    placeholder="Enter aadhar Number"
                    value={aadhar}
                    onChange={(e)=> setaadhar(e.target.value)}
                    maxLength='50'
                />

                <input
                    id='eventImage'
                    name='eventImage'
                    type='file'
                    onChange={handleFileChange}
                    style={{display:'none'}}
                />
                <div className='form-field animation a4'>
                    <label
                        htmlFor='eventImage'
                        style={{width:'100%'}}>
                        <span role='img' aria-label='upload'>☁️</span> Upload Photo Proof</label>
                </div>
                <small style={{margin:'5px'}}>
                    {file ? `Choosen file: ${file.name}`:null}
                </small>

                <button
                    className="animation a6"
                    onClick={handleSubmit}>Request</button>

            </div>}

            {isLoading && 
                <div className="form">
                    <Loader
                        type="TailSpin"
                        color="#8D3B72"
                        height={100}
                        width={100}
                    />
                </div>
            }

        </div>
    )
}

export default Approval