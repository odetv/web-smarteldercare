"use client";
import * as React from "react";
import { Typography } from "@mui/material";
import { useAuth } from "@/middleware/AuthenticationProviders";
import {
  Button,
  Input,
  Slider,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import AlertCheckAuth from "@/components/AlertCheckAuth";
import AlertLoginGuest from "@/components/AlertLoginGuest";
import AlertAuthorizedMember from "@/components/AlertAuthorizedMember";
import LineChartSuhu from "@/components/LineChartSuhu";
import Camera from "@/components/Camera";
import ButtonLED from "@/components/ButtonLED";
import { getDatabase, onValue, ref } from "firebase/database";
import WarningIcon from "@mui/icons-material/Warning";

export default function Dashboard() {
  const user = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [statusButton, setStatusButton] = useState("");
  const [statusLED, setStatusLED] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [prevStatusButton, setPrevStatusButton] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, "data");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      snapshot.forEach((dateSnapshot) => {
        dateSnapshot.forEach((timeSnapshot) => {
          const data = timeSnapshot.val();
          // if (data && data.status_button !== undefined) {
          //   const statusButtonReal = data.status_button == 1 ? "Hidup" : "Mati";
          //   setStatusButton(statusButtonReal);
          //   if (data.status_button == 1 && prevStatusButton !== 1) {
          //     onOpen(); // Open modal if status_button is 1 and was not 1 previously
          //   }
          //   setPrevStatusButton(data.status_button);
          // }
          if (data && data.status_button !== undefined) {
            const statusButtonReal = data.status_button == 1 ? "Hidup" : "Mati";
            setStatusButton(statusButtonReal);
            if (data.status_button == 1) {
              onOpen(); // Open modal if status_button is 1
            } else {
              onClose(); // Close modal if status_button is 0
            }
            setPrevStatusButton(data.status_button);
          }
          if (data && data.status_led !== undefined) {
            const statusLEDReal = data.status_led == 1 ? "Hidup" : "Mati";
            setStatusLED(statusLEDReal);
          }
        });
      });
    });

    return () => unsubscribe();
  }, [onOpen, onClose]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "member") {
        setIsAuthorized(true);
      }
      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }
  }, [user]);

  if (isCheckingAuth) {
    return <AlertCheckAuth />;
  }

  if (!user) {
    return <AlertLoginGuest />;
  }

  if (!isAuthorized) {
    return <AlertAuthorizedMember />;
  }

  return (
    <main className="flex flex-col justify-center items-center pt-2 sm:pt-8 mb-10">
      {user ? (
        <>
          <div className="text-center p-4 gap-2">
            <p className="text-xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-bold pb-2">
              Selamat datang di Dashboard, {user ? user.displayName : ""}👋
            </p>
            <p>Peduli Lansia untuk Keluarga Penuh Cinta</p>
          </div>
          <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 justify-center items-center gap-2 sm:gap-10 sm:w-3/4 p-4">
            <div className="">
              <div className="mb-4 p-8 bg-[#6ef6f8] rounded-lg">
                <ButtonLED />
              </div>
              <div className="outline outline-[#6ef6f8] p-4 rounded-xl">
                <LineChartSuhu />
              </div>
            </div>
            <div className="">
              <Camera />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col min-h-screen p-4 justify-center items-center gap-2">
          <Typography className="text-center">
            Anda tidak memiliki akses, silahkan masuk terlebih dahulu!
          </Typography>
          <AuthenticationForm />
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="mr-4 ml-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Peringatan
              </ModalHeader>
              <ModalBody className="p-6">
                <div className="flex flex-col justify-center items-center gap-1 pt-6 pb-6">
                  <WarningIcon color="warning" fontSize="large" />
                  <p>Lansia membutuhkan pengawasan!</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
