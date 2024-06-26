import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { client, db } from "@/utils/appwrite";
import AuthChatModal from "@/components/Chat/AuthChatModal";
import { parseJSON, sendMessage } from "@/utils/functions";

export async function getServerSideProps(context) {
  let ticketObject = {};
  try {
    const response = await db.getDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
      context.query.id
    );
    ticketObject = response;
  } catch (err) {
    ticketObject = {};
  }

  return {
    props: { ticketObject },
  };
}

const Chat = ({ ticketObject }) => {
  const [messages, setMessages] = useState(
    ticketObject?.messages?.map(parseJSON)
  );
  const [text, setText] = useState("");
  const [authModal, setAuthModal] = useState(true);
  const router = useRouter();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (ticketObject?.messages?.length < 1) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.${process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID}.documents`,
      (data) => {
        const messages = data.payload.messages;
        setMessages(messages.map(parseJSON));
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  if (authModal)
    return (
      <AuthChatModal
        setAuthModal={setAuthModal}
        chatCode={ticketObject.access_code}
      />
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(text, router.query.id);
    setText("");
  };

  return (
    <div>
       <Head>
        <title>Artsbyart Support</title>
        <meta name="description" content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full min-h-[90vh] flex items-center justify-center px-4">
          <div className="md:w-2/3 w-full border-[1px] rounded-md shadow-md">
            <header className="p-4 bg-white w-full">
              <h3>
                Ticket -{" "}
                <span className="text-blue-400">#{ticketObject.$id}</span>
              </h3>
            </header>
            <div className="w-full h-[400px] chatscreen p-4 overflow-y-scroll flex flex-col">
              {messages.map((message) => (
                <div key={message.id} className=" mb-3">
                  <div
                    className={`p-4 rounded-md max-w-[50%] text-[14px] ${
                      message.admin !== true
                        ? `bg-blue-300 text-gray-600 `
                        : `bg-white text-gray-600 ml-auto`
                    }`}
                  >
                    {message.content}
                  </div>

                  <p
                    className={`text-gray-500 text-sm ${
                      message.admin === true ? "text-right" : ""
                    }`}
                  >
                    {message.admin !== true
                      ? `${message.name}`
                      : `${message.name} - Admin`}
                  </p>
                </div>
              ))}
              <div ref={lastMessageRef} />
            </div>
            <footer className="p-4">
              <form
                className="flex items-center justify-between"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="message"
                  id="message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 mr-4 py-2 px-4 rounded h-full border-[1px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-[#314484]"
                >
                  SEND{" "}
                </button>
              </form>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
