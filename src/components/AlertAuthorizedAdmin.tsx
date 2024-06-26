import { Typography } from "@mui/material";

export default function AlertAuthorizedAdmin() {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen mx-auto p-4 -mt-16">
      <Typography>Maaf, hanya Admin yang dapat masuk!</Typography>
    </div>
  );
}
