import React, { useState, useEffect } from "react";
import { ID, Permission, Role } from "appwrite";
import { Trash2 } from "react-feather";
import {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  client,
  db,
} from "@/utils/appwrite";
import { useAuth } from "@/utils/AuthContent";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]); // List of contacts (ICs or Admins)
  const [activeContact, setActiveContact] = useState(null); // Currently selected contact
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchContacts();

      const unsubscribe = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
        (response) => {
          if (response.events.includes("databases.*.collections.*.documents.*.create")) {
            setMessages((prevState) => [response.payload, ...prevState]);
          }

          if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
            setMessages((prevState) =>
              prevState.filter((message) => message.$id !== response.payload.$id)
            );
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES);
      console.log("Fetched messages:", response.documents); // Log messages
      setMessages(response.documents);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const fetchContacts = async () => {
    try {
      const response = await db.listDocuments(DATABASE_ID, process.env.NEXT_PUBLIC_USERS_COLLECTION_ID);
      console.log("Fetched contacts:", response.documents); // Log contacts
      setContacts(response.documents);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeContact) return;

    try {
      const response = await db.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        {
          sender: user.$id,
          user_id: user.$id,
          username: user.name,
          receiver: activeContact.user_id,
          body: messageBody,
          timestamp: new Date().toISOString(),
          role: user.role,
        },
      );
      setMessageBody("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteMessage = async (id) => {
    await db.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
  };

  // Debugging: Log messages and activeContact
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Active contact:", activeContact);
    console.log("Messages:", messages);
  }, [user, activeContact, messages]);

  const filteredMessages = messages.filter(
    (message) =>
      (message.sender === user.$id && message.receiver === activeContact?.user_id) ||
      (message.receiver === user.$id && message.sender === activeContact?.user_id)
  );
  console.log("Filtered messages:", filteredMessages);

  return (
    <div className="chat-container flex">
      <div className="users-sidebar w-1/4 border-r p-4">
        {contacts.map((contact) => (
          <div
            key={contact.$id}
            className={`user-item p-4 cursor-pointer ${activeContact?.$id === contact.$id ? "bg-gray-200" : ""}`}
            onClick={() => setActiveContact(contact)}
          >
            {contact.name}
          </div>
        ))}
      </div>
      <div className="chat-content w-3/4 p-4">
        {activeContact ? (
          <>
            <div className="messages-list">
              {filteredMessages.map((message) => (
                <div key={message.$id} className={"message--wrapper"}>
                  <div className="message--header">
                    <p>
                      <span className="text-black ">{message?.username || "Anonymous user"}</span>
                      <small className="message-timestamp"> {new Date(message.$createdAt).toLocaleString()}</small>
                    </p>
                    {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                      <Trash2 className="delete--btn" onClick={() => deleteMessage(message.$id)} />
                    )}
                  </div>
                  <div className={"message--body bg-black" + (message?.user_id === user.$id ? " message--body--owner bg-black" : "")}>
                    <span className="text-white bg-black">{message.body}</span>
                  </div>
                </div>
              ))}
            </div>
            <form id="message--form" onSubmit={handleSendMessage} className="mt-4">
              <div>
                <textarea
                  required
                  maxLength="250"
                  placeholder="Say something..."
                  onChange={(e) => setMessageBody(e.target.value)}
                  value={messageBody}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <div className="send-btn--wrapper mt-2">
                <button type="submit" className="btn btn--secondary">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div>Please select a contact to start the conversation</div>
        )}
      </div>
    </div>
  );
};

export default Room;
