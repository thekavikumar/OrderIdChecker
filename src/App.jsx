import { useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set, get } from "firebase/database";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function App() {
  const [data, setData] = useState();
  const [orderId, setOrderId] = useState();

  const handleSubmit = async () => {
    const orderRef = ref(db, "orders/" + orderId);
    onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        // The record exists at the specified path
        const data = snapshot.val();
        setData(data);
        toast.success("Record found!");
      } else {
        toast.error("No record found with the given orderId");
      }
    });
  };

  const handleVerified = async () => {
    const orderRef = ref(db, "orders/" + orderId);
    const snapshot = await get(orderRef);
    if (snapshot.exists()) {
      set(orderRef, {
        ...snapshot.val(),
        verified: true,
      });
    }
  };

  return (
    <main className="flex flex-col gap-12 items-center justify-center h-screen">
      <Toaster position="top-center" />
      <img
        src="https://intranet.cb.amrita.edu/sites/default/files/inline-images/AMRIT-removebg-preview_2.png"
        alt="logo"
        className="w-[20%]"
      />
      <div className="flex items-center gap-4 justify-center flex-col">
        <input
          type="text"
          className="px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2 border border-blue-500 rounded-[3px]"
          placeholder="Enter the orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="px-3 py-2 rounded-md text-lg text-zinc-700 font-medium border border-blue-500 hover:bg-blue-500 hover:text-white duration-200 ease-in-out"
        >
          Search
        </button>
      </div>
      <div className="">
        {data && (
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Order Details</h1>
            <div className="flex flex-col gap-4">
              <p>
                <span className="font-semibold">OrderId:</span> {data.orderId}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> {data.amount}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {data.orderStatus}
              </p>
              <p>
                <span className="font-semibold">Verified:</span>{" "}
                {data.verified ? "Yes" : "No"}
              </p>
              <button
                onClick={handleVerified}
                disabled={data.verified}
                className="px-3 py-2 rounded-md border border-black"
              >
                Verified!
              </button>
            </div>
          </div>
        )}
      </div>
      <div className=" absolute p-3 bottom-0 flex flex-wrap text-center items-center w-full justify-center">
        <p className="text-gray-500 text-sm">
          Made with ❤️ by{" "}
          <a
            href="https://instagram.com/gdscavvchennai"
            className="text-blue-500 font-medium"
            target="_blank"
          >
            GDSC Amrita Vishwa Vidyapeetham, Chennai
          </a>
        </p>
      </div>
    </main>
  );
}

export default App;
