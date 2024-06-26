import { Spinner } from "@nextui-org/react";
import AuthenticationForm from "./AuthenticationForm";

export default function ButtonLoginGuest() {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen mx-auto gap-2 p-4 -mt-16">
      <Spinner
        label="Anda belum login. Silakan login terlebih dahulu!"
        color="success"
      />
      <AuthenticationForm />
    </div>
  );
}
