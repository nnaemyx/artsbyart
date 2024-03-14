import Head from "next/head";
import { useState } from "react";
import { startMessage } from "@/utils/functions";
import Processing from "./Processing";
import AuthNav from "./AuthNav";

export default function Chat({ productName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    startMessage(name, email, subject, productName, message, setLoading);
    setName("");
    setEmail("");
    setMessage("");
    setSubject("");
  };

  if (loading) return <Processing />;

  return (
    <>
      <Head>
        <title>Artsbyart</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full min-h-[100vh] overflow-hidden  ">
        <div className="w-full min-h-[90vh]  ">
          <div className="md:w-[60%] w-full h-full flex flex-col py-6 md:px-10 px-4 overflow-y-auto">
            <h2 className="font-bold text-2xl mb-2">Create Ticket</h2>
            <p className="opacity-50 mb-6 text-sm">
              Chat with us, we are available 24/7
            </p>
            <form className="" onSubmit={handleSubmit}>
              <div className="">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
                />
              </div>

              <div className="">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
                  value={productName}
                  readOnly
                />
              </div>

              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
              />
              <label htmlFor="message">Message</label>
              <textarea
                rows={5}
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4 border-[1px] border-gray-200 px-4 py-2 w-full"
              ></textarea>

              <button className="p-3 bg-[#314484] rounded text-[#F4F8FB] w-[200px] hover:bg-[#2267D3]">
                Send message
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
