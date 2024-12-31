import { useState } from "react";

const Channels = ({ provider, account, dappcord,channels, currentChannel, setCurrentChannel }) => {
// console.log(account);
  //handling the channel
  const channelHandler=async(elem)=>{
   const hasJoined=await dappcord.hasJoined(elem.id, account);
   if(hasJoined)
    setCurrentChannel(elem);
  else{
    const signer=await provider.getSigner();
    const transaction=await dappcord.connect(signer).mint(elem.id, {value:elem.cost});
    await transaction.wait();
    setCurrentChannel(elem);
  }


  }


  return ( 
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>
        <ul>
          {
            channels.map((channel , index)=>(
              <li key={index} 
              className={currentChannel && currentChannel.id===channel.id?"active":""}
              
              onClick={()=>channelHandler(channel)}>{channel.name}</li>

            ))
 
          }
        </ul>

      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;