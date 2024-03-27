import { account } from '@/utils/appwrite';
import React, { useEffect, useState } from 'react'

function Chat({ key, msg }) {

    const [user, setUser] = useState({})

    useEffect(() => {
        const promise = account.get()
        promise.then(function (response) {
            console.log(response)
            setUser(response)
        }, function (error) {
            console.log(error)
        })

    }, [])

    const chatType = user.email === msg.emailId ? 'sent' : 'received'

    return (

        <div className='chatAll'>
            <span className={chatType} key={msg.key}>
                <span className='user-name'>{user.name}</span>
                <span>{msg.message}</span>
            </span>
        </div>
    )
}

export default Chat
