"use client";
import * as React from "react";
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
import {
  ref,
  get,
  getDatabase,
  onValue,
  query,
  limitToLast,
  remove,
} from "firebase/database";
import { useEffect, useState } from "react";
import Image from "next/image";
import RedIcon from "../assets/images/components/red-circle.gif";
import WarningIcon from "@mui/icons-material/Warning";
import Lansia from "@/assets/images/components/lansia.jpg";

export default function Camera() {
  const [isSelectedAI, setIsSelectedAI] = React.useState(true);
  const [isPreviewAI, setIsPreviewAI] = React.useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [photoLansia, setPhotoLansia] = useState("");
  const [statusLansia, setStatusLansia] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [statusGerak, setStatusGerak] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const photosRef = ref(db, "esp32cam");
    const unsubscribe = onValue(photosRef, (snapshot) => {
      let deletePromises: any[] = [];
      snapshot.forEach((dateSnapshot) => {
        dateSnapshot.forEach((timeSnapshot) => {
          const data = timeSnapshot.val();
          const timestamp = data.timestamp;
          const date = new Date(timestamp);
          const year = date.getFullYear();
          if (year === 2036) {
            console.log(`Removing invalid entry with timestamp: ${timestamp}`);
            const deletePromise = remove(timeSnapshot.ref)
              .then(() => {
                console.log("Invalid entry removed successfully");
              })
              .catch((error) => {
                console.error("Error removing invalid entry:", error);
              });
            deletePromises.push(deletePromise);
          }
        });
      });
      Promise.all(deletePromises).then(() => {
        const latestPhotoQuery = query(photosRef, limitToLast(1));
        onValue(latestPhotoQuery, (latestSnapshot) => {
          latestSnapshot.forEach((latestDateSnapshot) => {
            latestDateSnapshot.forEach((latestTimeSnapshot) => {
              const latestData = latestTimeSnapshot.val();
              const latestBase64String = latestData.photo_original;
              const latestPhotoLansia = latestData.photo_lansia;
              let latestStatusLansia = latestData.status_lansia;
              const latestTimestamp = latestData.timestamp;
              if (latestBase64String) {
                setImageUrl(latestBase64String);
              }
              if (latestPhotoLansia) {
                setPhotoLansia(latestPhotoLansia);
              }
              if (
                latestStatusLansia === "true" ||
                latestStatusLansia === "false"
              ) {
                latestStatusLansia = JSON.parse(latestStatusLansia);
                setStatusLansia(
                  latestStatusLansia ? "Terdeteksi" : "Tidak Terdeteksi"
                );
              } else {
                setStatusLansia("Tidak Terdeteksi");
              }
              if (latestTimestamp) {
                setTimestamp(latestTimestamp);
              }
            });
          });
        });
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const dataRef = ref(db, "data");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      snapshot.forEach((dateSnapshot) => {
        dateSnapshot.forEach((timeSnapshot) => {
          const data = timeSnapshot.val();
          if (data && data.sensor_gerak !== undefined) {
            const statusGerakReal = data.sensor_gerak == 1 ? "Hidup" : "Mati";
            setStatusGerak(statusGerakReal);
          }
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        id="ai"
        className="bg-[#6ef6f8] p-4 rounded-xl text-center flex flex-col justify-center items-center w-full"
      >
        <p className="font-semibold text-md">Monitoring Lansia</p>
        <p className="text-sm">
          {isSelectedAI && isPreviewAI
            ? "Pantau Aktivitas Lansia Secara Realtime (AI)"
            : "Pantau Aktivitas Lansia Secara Realtime (No-AI)"}
        </p>
        <div>
          <div className="flex flex-row gap-1 mt-2 mb-2 bg-[#50e3e6] p-2 rounded-lg justify-center items-center">
            <p className="text-sm">
              Deteksi Gerakan:{" "}
              <span className="font-semibold">{statusGerak}</span>
            </p>
          </div>
          <div className="relative flex justify-center items-center">
            {isSelectedAI && isPreviewAI ? (
              <>
                {photoLansia ? (
                  <>
                    <Chip
                      startContent={
                        <Image
                          src={RedIcon}
                          alt="Red Icon"
                          width={8}
                          height={8}
                        />
                      }
                      color="danger"
                      variant="dot"
                      size="sm"
                      className="absolute top-4 right-4 z-10 bg-white opacity-50 pl-2"
                    >
                      <p className="pl-1">Live</p>
                    </Chip>
                    <div className="flex flex-col">
                      <Image
                        width={640}
                        height={640}
                        src={Lansia}
                        // src={photoLansia}
                        alt="Pantau Hama Tanaman"
                        className="rounded-lg"
                      />
                      <div className="pt-2 text-xs flex flex-row">
                        <p className="font-semibold pr-1">Update Terakhir:</p>
                        <p>{timestamp}</p>
                      </div>
                      <div className="text-xs flex flex-row">
                        <p className="font-semibold pr-1">Status Lansia:</p>
                        <p>{statusLansia}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-1 pt-6 pb-6">
                    <WarningIcon color="warning" fontSize="medium" />
                    <p className="text-sm">Kamera Tidak Aktif!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {imageUrl ? (
                  <>
                    <Chip
                      startContent={
                        <Image
                          src={RedIcon}
                          alt="Red Icon"
                          width={8}
                          height={8}
                        />
                      }
                      color="danger"
                      variant="dot"
                      size="sm"
                      className="absolute top-4 right-4 z-10 bg-white opacity-50 pl-2"
                    >
                      <p className="pl-1">Live</p>
                    </Chip>
                    <div className="flex flex-col">
                      <Image
                        width={640}
                        height={640}
                        src={imageUrl}
                        alt="Pantau Kamera Pengintai"
                        className="rounded-lg"
                      />
                      <div className="pt-2 text-xs flex flex-row">
                        <p className="font-semibold pr-1">Update Terakhir:</p>
                        <p>{timestamp}</p>
                      </div>
                      <div className="text-xs flex flex-row">
                        <p className="font-semibold pr-1">Status Lansia: </p>
                        <p>-</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-1 pt-6 pb-6">
                    <WarningIcon color="warning" fontSize="medium" />
                    <p className="text-sm">Kamera Tidak Aktif!</p>
                  </div>
                )}
              </>
            )}
          </div>
          {/* <div className="flex flex-row justify-center items-center pt-2">
            <p className="text-sm">Komparasi</p>
            <Switch
              className="pl-2"
              size="sm"
              isSelected={isPreviewAI}
              onValueChange={setIsPreviewAI}
              defaultSelected
              color="success"
            ></Switch>
          </div> */}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        placement="center"
        backdrop="blur"
        onOpenChange={onOpenChange}
        size="xl"
        className="mr-4 ml-4"
      >
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isSelectedAI && isPreviewAI
                  ? "Pantau Aktivitas Lansia (AI)"
                  : "Pantau Aktivitas Lansia (No-AI)"}
              </ModalHeader>
              <ModalBody>
                <div className="relative flex justify-center items-center">
                  {isSelectedAI && isPreviewAI ? (
                    <>
                      {photoLansia ? (
                        <>
                          <Chip
                            startContent={
                              <Image
                                src={RedIcon}
                                alt="Red Icon"
                                width={8}
                                height={8}
                              />
                            }
                            color="danger"
                            variant="dot"
                            size="sm"
                            className="absolute top-4 right-4 z-10 bg-white opacity-50 pl-2"
                          >
                            <p className="pl-1">Live</p>
                          </Chip>
                          <div className="flex flex-col">
                            <Image
                              width={640}
                              height={640}
                              src={photoLansia}
                              alt="Pantau Hama Tanaman"
                              className="rounded-lg"
                            />
                            <div className="pt-2 text-xs flex flex-row">
                              <p className="font-semibold pr-1">
                                Update Terakhir:
                              </p>
                              <p>{timestamp}</p>
                            </div>
                            <div className="text-xs flex flex-row">
                              <p className="font-semibold pr-1">
                                Deteksi Gerakan:
                              </p>
                              <p>{statusLansia}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-1 pt-6 pb-6">
                          <WarningIcon color="warning" fontSize="medium" />
                          <p className="text-sm">Kamera Tidak Aktif!</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {imageUrl ? (
                        <>
                          <Chip
                            startContent={
                              <Image
                                src={RedIcon}
                                alt="Red Icon"
                                width={8}
                                height={8}
                              />
                            }
                            color="danger"
                            variant="dot"
                            size="sm"
                            className="absolute top-4 right-4 z-10 bg-white opacity-50 pl-2"
                          >
                            <p className="pl-1">Live</p>
                          </Chip>
                          <div className="flex flex-col">
                            <Image
                              width={640}
                              height={640}
                              src={imageUrl}
                              alt="Pantau Kamera Pengintai"
                              className="rounded-lg"
                            />
                            <div className="pt-2 text-xs flex flex-row">
                              <p className="font-semibold pr-1">
                                Update Terakhir:
                              </p>
                              <p>{timestamp}</p>
                            </div>
                            <div className="text-xs flex flex-row">
                              <p className="font-semibold pr-1">
                                Deteksi Gerakan:{" "}
                              </p>
                              <p>-</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-1 pt-6 pb-6">
                          <WarningIcon color="warning" fontSize="medium" />
                          <p className="text-sm">Kamera Tidak Aktif!</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row items-center pr-2">
                  <p className="text-sm">Komparasi</p>
                  <Switch
                    className="pl-2"
                    size="sm"
                    isSelected={isPreviewAI}
                    onValueChange={setIsPreviewAI}
                    defaultSelected
                    color="success"
                  ></Switch>
                </div>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
