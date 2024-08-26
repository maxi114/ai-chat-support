"use client";
import MessageInput from "@/components/ui/message-input";

const Page = ({ params }) => {
  return (
    <div className="grid h-[calc(100vh-72.8px)] grid-cols-3">
      <div className="border-r border-gray-200 p-5">
        <div className="border border-gray-200 p-5">

          <h1 className = "font-bold">Read below to uderstand what this AI chat does </h1>
          <br/><br/>

          <p>
         This chat is an AI-powered customer support assistant named Alex at a car dealership, Auto Choice. The assistant helps users explore vehicle options, financing, and after-sales services, ensuring a seamless experience. Alex is also responsible for maintaining user privacy.
          </p>
          <br/><br/>
          <p>Ask Alex in the chat below how he can assist you</p>
          <br/><br/>
          <p>PSA: this is just a demo and not connected to a real dealership</p>

        </div>
      </div>

      <div className="col-span-2">
        <MessageInput />
      </div>

      <div className="border-l border-gray-200 p-5"></div>
    </div>
  );
};
export default Page;
