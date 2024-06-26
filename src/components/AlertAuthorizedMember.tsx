import { Typography } from "@mui/material";

export default function AlertAuthorizedMember() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-4 -mt-16">
      <Typography>
        Maaf, hanya Member yang dapat masuk! Silahkan hubungi Admin untuk
        informasi lebih lanjut.
      </Typography>
    </div>
  );
}
