import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import Search from './SearchBar/Search';
import HomeNavigator from './HomeNavigator/HomeNavigator';
import DirectMessagesText from './DirectMessages/DirectMessagesText';
import Conversations from './Conversations/Conversations';
import UserBar from './UserBar/UserBar';
import { Context } from '../../Context/Context';

// styles
import "./ContactsBar.css"

const ContactsBar = ({ highlighted, selected, setSelected }) => {
  const { user, conversations, setConversations } = useContext(Context)
  const [constantConversations,setConstantConversations] = useState([])
  const [query,setQuery] = useState("")

  useEffect(() => {
    fetchConversations()
  },[])

  useEffect(() => {
    filterConversations()
  },[query])

  const fetchConversations = async () => {
    try {
      const conversations = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/fetch`,{
        id: user.id
      }, {
        withCredentials: true
      })
      setConversations(conversations.data)
      setConstantConversations(conversations.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterConversations = () => {
    setConversations(constantConversations.filter(e => e.users[0].username.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='home-contacts-bar'>
          
      <Search setQuery={setQuery}/>

      <div id='home-contacts-navigators'>
        <HomeNavigator selected={selected} setSelected={setSelected} text="Friends"/>
        <HomeNavigator selected={selected} setSelected={setSelected} text="Turbo" style={{ marginTop: 5 }}/>
      </div>

      <DirectMessagesText id={user.id} fetchConversations={fetchConversations}/>
      <Conversations
        conversations={conversations}
        highlighted={highlighted}/>
      <UserBar/>

    </div>
  );
};

export default ContactsBar;