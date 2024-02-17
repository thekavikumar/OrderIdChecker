import { useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set, get } from "firebase/database";

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
      } else {
        // The record does not exist at the specified path
        setData(null);
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
    </main>
  );
}

export default App;
