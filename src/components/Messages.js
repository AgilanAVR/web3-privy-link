import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel }) => {

  //useref
  const messageEndRef=useRef(null);

  //form handler
  const [message , setMessage]=useState('')

  const sendMessage=(e)=>{
    e.preventDefault();
    console.log(message);
    const msgObj={
      channel:currentChannel.id.toString(),
      account:account,
      text:message
    }
    if(message!=="")
    socket.emit('new message',msgObj);
    setMessage("");
    console.log(messages);
  }


  const scrollHandler=()=>{
    setTimeout(()=>{
     messageEndRef.current.scrollIntoView({behavior:'smooth'})
    },500)
  }

  useEffect(()=>{
    scrollHandler();
  })

  return (
    <div className="text">
      <div className="messages">
        {messages.filter(msg=>msg.channel==currentChannel.id).map((message , index)=>(
          <div className="message" key={index}>
            <img src={person} alt="" />
            <div className="message_content">
              <h3>{message.account.slice(0,6)+"..."+message.account.slice(38,42)}</h3>
              <p>
                {message.text}
              </p>
            </div>
          </div>
          
        ))}
        <div ref={messageEndRef}/>
      </div>

      <form onSubmit={(e)=>sendMessage(e)}>
        {account?(
        <input type="text" name="" value={message} id="" onChange={(e)=>{setMessage(e.target.value)}} placeholder={`Message from ${account.slice(0,6)+"..."+account.slice(38,42)}`}/>
        ):(
        <input type="text" name="" id="" placeholder='connect to wallet...'/>
        )}
        <button type="submit"><img src={send} alt="" /></button>
      </form>



    </div>
  );
}

export default Messages;