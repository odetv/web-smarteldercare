import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import CampaignIcon from "@mui/icons-material/Campaign";

function notificationsLabel(count: number) {
  if (count === 0) {
    return "no notifications";
  }
  if (count > 99) {
    return "more than 99 notifications";
  }
  return `${count} notifications`;
}

export default function AccessibleBadges() {
  return (
    <Popover
      placement="bottom"
      showArrow={false}
      radius="md"
      shadow="lg"
      className=""
    >
      <PopoverTrigger>
        <IconButton aria-label={notificationsLabel(100)}>
          <Badge
            badgeContent={0}
            color="warning"
            variant="standard"
            className="text-default-400"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-base font-bold">Notifikasi</div>
          <div className="p-32 flex justify-center items-center">
            <div className="absolute text-center flex flex-col gap-1 justify-center items-center">
              <CampaignIcon color="disabled" fontSize="medium" />
              <p className="text-sm">Tidak ada notifikasi terbaru.</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
