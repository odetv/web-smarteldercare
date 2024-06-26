import { Spinner } from "@nextui-org/react";

export default function AlertCheckAuth() {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen mx-auto p-4 -mt-16">
      <Spinner label="Memeriksa autentikasi..." color="success" />
    </div>
  );
}
