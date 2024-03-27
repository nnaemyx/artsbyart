import React, { useState, useEffect } from "react";
import { ID, Query, Permission, Role } from "appwrite";
import { Trash2 } from "react-feather";
import {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  account,
  client,
  db,
} from "@/utils/appwrite";
import { useAuth } from "@/utils/AuthContent";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `db.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (response.events.includes("db.*.collections.*.documents.*.create")) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (response.events.includes("db.*.collections.*.documents.*.delete")) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    console.log("unsubscribe:", unsubscribe);

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    try {
      const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES);
      const filteredMessages = response.documents.filter(message => {
        // Modify this condition based on your filtering criteria
        return message.sender === "admin" || message.user_id === user.$id ;
      });
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("MESSAGE:", messageBody);
    try {
      // Send message with role set to "IC"
      const response = await db.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        {
          sender: "IC",
          user_id: user?.$id,
          username: user?.name,
          receiver: "admin",
          body: messageBody,
          timestamp: new Date().toISOString(),
          role: "IC",
        },
      );
      console.log("RESPONSE:", response);
      // Refetch messages after sending
      setMessageBody("");
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("MESSAGE:", messageBody);

  //   const permissions = [Permission.write(Role.user(user?.$id))];

  //   const payload = {
  //     user_id: user?.$id,
  //     username: user?.name,
  //     body: messageBody,
  //   };

  //   const response = await db.createDocument(
  //     DATABASE_ID,
  //     COLLECTION_ID_MESSAGES,
  //     ID.unique(),
  //     payload,
  //     permissions
  //   );

  //   console.log("RESPONSE:", response);

  //   setMessageBody("");
  // };

  const deleteMessage = async (id) => {
    await db.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
    //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
  };

  return (
    <main className="container">
      <div className="room--container">
 

        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span className="text-blue-300"> {message?.username}</span>
                  ) : (
                    "Anonymous user"
                  )}

                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete(\"user:${user?.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>

              <div
                className={
                  "message--body" +
                  (message?.user_id === user?.$id
                    ? " message--body--owner"
                    : "")
                }
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>

        <form id="message--form" onSubmit={handleSendMessage}>
          <div>
            <textarea
              required
              maxLength="250"
              placeholder="Say something..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <button type="submit" className="btn btn--secondary">
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Room;
