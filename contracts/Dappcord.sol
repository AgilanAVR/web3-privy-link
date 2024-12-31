// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Dappcord is ERC721 {
    //state variables
    address public owner;
    uint256 public channelno=0;
    uint256 public totalSupply = 0;


    //struct for channels
    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    //mapping for the channel with their channelno
    mapping(uint256 => Channel) public channels;
    mapping(uint256 =>mapping(address=>bool))public hasJoined;


    //modifiers..
    modifier onlyOwner(){
        require(msg.sender==owner,"owner only allowed");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    //creating channel
    function createChannel(string memory _name, uint256 _cost) public onlyOwner{
        channelno++;
        channels[channelno] = Channel(channelno, _name, _cost);
    }


    //joining into channel
    function mint(uint256 _channelID)public payable{

        //requires
        require(_channelID!=0,"invalid channel");
        require(_channelID <= channelno , "CHannel not available");
        require( hasJoined[_channelID][msg.sender]==false , "User already exist");
        require(msg.value >= channels[_channelID].cost , "Insufficient amount");

      
      //join channel
      hasJoined[_channelID][msg.sender]=true;
      //mint nft
      totalSupply++;
      _safeMint(msg.sender, totalSupply);

    }

    function withDraw()public onlyOwner{
        (bool success, ) = owner.call{value:address(this).balance}("");
        require(success);
    }
}
