import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  query,
  limitToLast,
  getDatabase,
} from "firebase/database";
import { database } from "../../firebaseConfig"; // Sesuaikan path dengan file firebase Anda

const useStatusEsp = () => {
  const [status, setStatus] = useState<string | null>(null);

  //   useEffect(() => {
  //     const statusRef = ref(database, "esp/data");
  //     const latestStatusQuery = query(statusRef, limitToLast(1));

  //     const unsubscribe = onValue(latestStatusQuery, (snapshot) => {
  //       const data = snapshot.val().status_esp;
  //       setStatus(data);
  //     });

  //     return () => unsubscribe();
  //   }, []);

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, "esp/data");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Dapatkan keys (id) dari objek data
        const keys = Object.keys(data);
        // Ambil data dari id terbaru yang memiliki tanda strip (-) di awal
        const latestId = keys.find((key) => key.startsWith("-"));
        if (latestId) {
          const latestStatus = data[latestId].status_esp;
          setStatus(latestStatus);
        } else {
          setStatus(null); // Jika tidak ada id yang sesuai, atur status menjadi null
        }
      } else {
        setStatus(null); // Atur status menjadi null jika snapshot kosong
      }
    });

    return () => unsubscribe();
  }, []);

  return status;
};

export default useStatusEsp;
