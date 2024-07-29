import Head from "next/head";
import { useState } from "react";
import { startMessage } from "@/utils/functions";
import Processing from "@/components/Chat/Processing";



export default function Createorder() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    startMessage(name, email, message, productName, phoneNumber, setLoading);
    setName("");
    setEmail("");
    setProductName("");
    setPhoneNumber("");
    setMessage("");
  };

  if (loading) return <Processing />;

  const sendSMS = async () => {
    try {
      const response = await fetch("/api/sms", {
        // Change this to your Twilio API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "+2347069363614",
          message:
            "Hello Admin, there is a new order, log in now and chat with the user",
        }),
      });

      if (response.ok) {
        console.log("SMS sent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };


  return (
    <>
      <Head>
        <title>Artsbyart - Admin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" ">
        <div className="  ">
          <div className="md:w-[60%] w-full h-full flex flex-col py-6 md:px-10 px-4 overflow-y-auto">
            <h2 className="font-bold text-2xl mb-2">Create Order</h2>
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
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="">
                <label htmlFor="productName">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {/* <div className="">
                <label htmlFor="productName">Procedures</label>
                <input
                  type="text"
                  id="procedures"
                  className="w-full border-[1px] border-gray-200 px-4 py-2 rounded mb-4"
                  value={procedures}
                  readOnly
                />
              </div> */}
              <label htmlFor="message">Message</label>
              <textarea
                rows={5}
                id="message"
                required
                value={message}
                placeholder="Customize your order"
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4 border-[1px] border-gray-200 px-4 py-2 w-full"
              ></textarea>

              <button
                onClick={sendSMS}
                className="p-3 bg-[#314484] rounded text-[#F4F8FB] w-[200px] hover:bg-[#2267D3]"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
