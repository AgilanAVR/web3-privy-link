import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {

  //useStates
  const [account , setAccount]=useState(null);
  const [provider , setProvider]=useState(null);
  const [dappcord , setDappcord]=useState(null);
  const [_Channels , setChannels]=useState([]);
  const [currentChannel , setCurrentChannel]=useState([]);
  const [messages , setMessages]=useState([]);





  //connecting to blockchain
  const loadBlockChain=async()=>{

    //ether.js
    const provider=new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);


    //netwok id
    const network=await provider.getNetwork();

    //contracts
    const dappcord=new ethers.Contract(config[network.chainId].Dappcord.address, Dappcord , provider);
    setDappcord(dappcord);

    //getting the channel data
    const totalChannel = await dappcord.channelno();
    const channels=[];
    for(let i=1;i<=totalChannel;i++){
    const channel=await dappcord.channels(i);
    channels.push(channel);
    }
    setChannels(channels);


  



    window.ethereum.on('accountsChanged',async()=>{
      window.location.reload();
    })

  }

  useEffect(()=>{
    loadBlockChain();

    //---> https://socket.io/connecing to the port 3030 for the chatting purpose

    socket.on("connect",()=>{
      socket.emit('get messages');  //if the socket is connected , then the messges can be emitted from getting message
    })

    socket.on("new message",(messages)=>{
      setMessages(messages);
    })

    socket.on("get messages",(messages)=>{
      setMessages(messages);
    })

      return () => {
    socket.off('connect')
    socket.off('new message')
    socket.off('get messages')
     }
  },[])

  return (
    <div>
    <Navigation account={account} setAccount={setAccount}/>
      <main>
      <Servers/>
      <Channels
      provider={provider}
      account={account}
      dappcord={dappcord}
      channels={_Channels}
      currentChannel={currentChannel}
      setCurrentChannel={setCurrentChannel}
      />
      <Messages account={account} messages={messages} currentChannel={currentChannel}/>

      </main>
    </div>
  );
}

export default App;
