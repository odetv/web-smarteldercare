"use client";
import React, { useEffect } from "react";
import { app } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";

import {
  Link,
  Input,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Checkbox,
  Button,
  Tabs,
  Tab,
  Tooltip,
} from "@nextui-org/react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { useUserAuthentication } from "../services/usersService";

export default function AuthenticationForm() {
  const {
    fullName,
    setdisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    user,
    setUser,
    photoProfile,
    setPhotoProfile,
    profileImageUrl,
    setProfileImageUrl,
    previewUrl,
    setPreviewUrl,
    isPhotoSelected,
    setIsPhotoSelected,
    signInWithGoogle,
    handleSignInWithEmailAndPassword,
    handleSignUpWithEmailAndPassword,
    handleProfileImageChange,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validatePhoto,
  } = useUserAuthentication();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = React.useState<string | number>("masuk");
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((userData) => {
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <>
      <Button
        color="primary"
        variant="flat"
        onClick={onOpen}
        className="font-medium"
        radius="sm"
      >
        Masuk
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        scrollBehavior="outside"
        shadow="lg"
        className="mr-4 ml-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div className="text-center">
                <Tabs
                  aria-label="Options"
                  variant="underlined"
                  size="md"
                  color="primary"
                  className="pt-4 font-semibold text-sm"
                  selectedKey={selected}
                  onSelectionChange={setSelected}
                >
                  <Tab key="masuk" title="Masuk">
                    <ModalHeader className="flex flex-col text-center">
                      <p>Masuk</p>
                      <p className="pb-2 text-sm font-normal">
                        Jelajahi Kembali Smart Elder Care
                      </p>
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        id="emailMasuk"
                        endContent={<EmailIcon color="disabled" />}
                        isRequired
                        label="Email"
                        placeholder="Email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        id="passwordMasuk"
                        isRequired
                        label="Password"
                        placeholder="Password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="flex py-2 px-1 justify-between">
                        <Checkbox
                          classNames={{
                            label: "text-small",
                          }}
                        >
                          Ingat Saya
                        </Checkbox>

                        <Link color="primary" href="#" size="sm">
                          Lupa Password?
                        </Link>
                      </div>
                      <div className="flex flex-col gap-2">
                        {error && (
                          <p className="text-red-500 text-xs">{error}</p>
                        )}
                        <button
                          onClick={handleSignInWithEmailAndPassword}
                          className="bg-[#058789] w-full mx-auto rounded-lg py-2 text-white hover:bg-[#2c797a] transition-all ease-in-out font-semibold"
                        >
                          Masuk
                        </button>
                        <Divider className="text-xs">Atau</Divider>
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center justify-center w-full mx-auto">
                            <button
                              onClick={signInWithGoogle}
                              className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out"
                            >
                              <Image
                                className="w-6 h-6"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                loading="lazy"
                                alt="google logo"
                                width={24}
                                height={24}
                              />
                              <p className="text-sm">Lanjutkan dengan Google</p>
                            </button>
                          </div>
                          <div className="flex flex-row gap-1 justify-center pb-6">
                            <p className="text-sm">Belum punya akun?</p>

                            <Link
                              className="text-sm font-semibold text-[#FF914D] hover:text-emerald-800 transition-all ease-in-out cursor-pointer"
                              size="sm"
                              onPress={() => setSelected("daftar")}
                            >
                              Daftar Sekarang
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Tab>
                  <Tab key="daftar" title="Daftar">
                    <ModalHeader className="flex flex-col text-center">
                      <p>Daftar</p>
                      <p className="pb-2 text-sm font-normal">
                        Jadilah Bagian Smart Elder Care
                      </p>
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        endContent={<PersonIcon color="disabled" />}
                        isRequired
                        label="Nama Lengkap"
                        placeholder="Nama Lengkap"
                        variant="bordered"
                        value={fullName}
                        onChange={(e) => setdisplayName(e.target.value)}
                      />
                      <Input
                        id="emailDaftar"
                        endContent={<EmailIcon color="disabled" />}
                        isRequired
                        label="Email"
                        placeholder="Email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        id="passwordDaftar"
                        isRequired
                        label="Password"
                        placeholder="Password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Input
                        id="passwordDaftarKonfirmasi"
                        isRequired
                        label="Konfirmasi Password"
                        placeholder="Konfirmasi Password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                      <div className="flex flex-col justify-center items-center rounded-md pt-4 pb-4 cursor-pointer outline-dashed outline-gray-300 outline-2 outline-offset-2 m-1 bg-slate-100">
                        <p
                          className="text-center text-xs text-gray-600"
                          style={{
                            display: isPhotoSelected ? "none" : "inline-block",
                          }}
                        >
                          Upload Foto Profil
                        </p>
                        <input
                          id="photoProfile"
                          type="file"
                          className="text-xs text-gray-600"
                          onChange={handleProfileImageChange}
                          style={{
                            display: isPhotoSelected ? "none" : "inline-block",
                          }}
                        />
                        {previewUrl && (
                          <div className="relative">
                            <Image
                              src={previewUrl}
                              alt="Preview Foto Profil"
                              className="w-32 h-32 rounded-full object-cover mt-2"
                            />
                            <button
                              className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 p-1 bg-white rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none"
                              onClick={() => {
                                setPreviewUrl(null);
                                setPhotoProfile(null);
                                setIsPhotoSelected(false);
                                const fileInput = document.getElementById(
                                  "photoProfile"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.value = "";
                                }
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {error && (
                          <p className="text-red-500 text-xs">{error}</p>
                        )}
                        <button
                          onClick={() => {
                            handleSignUpWithEmailAndPassword(
                              email,
                              password,
                              fullName,
                              confirmPassword
                            );
                          }}
                          className="bg-[#058789] w-full mx-auto rounded-lg py-2 text-white hover:bg-[#2c797a] transition-all ease-in-out font-semibold"
                        >
                          Daftar
                        </button>

                        <Divider className="text-xs">Atau</Divider>
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center justify-center w-full mx-auto">
                            <button
                              onClick={signInWithGoogle}
                              className="justify-center w-full mx-auto px-4 py-2 border flex gap-2 items-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-all ease-in-out"
                            >
                              <Image
                                className="w-6 h-6"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                loading="lazy"
                                alt="google logo"
                                width={24}
                                height={24}
                              />
                              <p className="text-sm">Lanjutkan dengan Google</p>
                            </button>
                          </div>
                          <div className="flex flex-row gap-1 justify-center pb-6">
                            <p className="text-sm">Sudah punya akun?</p>

                            <Link
                              className="text-sm font-semibold text-[#FF914D] hover:text-emerald-800 transition-all ease-in-out cursor-pointer"
                              size="sm"
                              onPress={() => setSelected("masuk")}
                            >
                              Masuk
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Tab>
                </Tabs>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
