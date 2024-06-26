"use client";
import { useRef, useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import {
  get,
  getDatabase,
  limitToLast,
  onValue,
  query,
  ref,
  remove,
} from "firebase/database";

export default function ButtonLED() {
  const [statusButton, setStatusButton] = useState("");
  const [statusLED, setStatusLED] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, "data");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      snapshot.forEach((dateSnapshot) => {
        dateSnapshot.forEach((timeSnapshot) => {
          const data = timeSnapshot.val();
          if (data && data.status_button !== undefined) {
            const statusButtonReal = data.status_button == 1 ? "Hidup" : "Mati";
            setStatusButton(statusButtonReal);
          }
          if (data && data.status_led !== undefined) {
            const statusLEDReal = data.status_led == 1 ? "Hidup" : "Mati";
            setStatusLED(statusLEDReal);
          }
        });
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-4">
        <div className="p-4 bg-slate-100 rounded-lg">
          <p>
            Status Button: <span className="font-semibold">{statusButton}</span>
          </p>
        </div>
        <div className="p-4 bg-slate-100 rounded-lg">
          <p>
            Status LED: <span className="font-semibold">{statusLED}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
