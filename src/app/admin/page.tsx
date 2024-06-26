"use client";
import * as React from "react";
import { Select, MenuItem } from "@mui/material";
import { useAuth } from "@/middleware/AuthenticationProviders";
import { database } from "../../../firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
} from "@nextui-org/react";
import AlertLoginGuest from "@/components/AlertLoginGuest";
import AlertCheckAuth from "@/components/AlertCheckAuth";
import AlertAuthorizedAdmin from "@/components/AlertAuthorizedAdmin";
import { SearchIcon } from "@/components/SearchIcon";

export default function Admin() {
  const user = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [users, setUsers] = useState<
    {
      uid: string;
      displayName: string;
      email: string;
      role: string;
      lastLogin: number;
      loginTime: number;
    }[]
  >([]);
  const [activeUsers, setActiveUsers] = useState<
    {
      uid: string;
      displayName: string;
      email: string;
      role: string;
      lastLogin: number;
      loginTime: number;
    }[]
  >([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setIsAuthorized(true);
      }
      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }
  }, [user]);

  const handleChangeRole = (userId: any, newRole: unknown) => {
    const userRef = ref(database, `users/${userId}/role`);
    set(userRef, newRole);
  };

  useEffect(() => {
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const usersList = Object.values(usersData).map((user) => {
        const typedUser = user as {
          uid: string;
          displayName: string;
          email: string;
          role: string;
          lastLogin: number;
          loginTime: number;
        };
        return {
          ...typedUser,
          role:
            typedUser.role ||
            process.env.NEXT_PUBLIC_VERCEL_DEFAULT_USER_ROLE ||
            "",
        };
      });
      setUsers(usersList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const activeUsersList = Object.values(usersData)
        .filter((user: any) => user.isActive)
        .map((user) => {
          const typedUser = user as {
            uid: string;
            displayName: string;
            email: string;
            role: string;
            lastLogin: number;
            loginTime: number;
          };
          return {
            ...typedUser,
            role: typedUser.role || "registered",
          };
        });
      setActiveUsers(activeUsersList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [pageListUser, setPageListUser] = useState(1);
  const rowsPerPageListUser = 5;
  const pagesListUser = Math.ceil(users.length / rowsPerPageListUser);
  const paginatedListUser = React.useMemo(() => {
    // const start = (pageListUser - 1) * rowsPerPageListUser;
    // const end = start + rowsPerPageListUser;
    // return users.slice(start, end);
    const filteredUsers = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const start = (pageListUser - 1) * rowsPerPageListUser;
    const end = start + rowsPerPageListUser;
    return filteredUsers.slice(start, end);
    // }, [pageListUser, users]);
  }, [pageListUser, users, searchQuery]);

  const [pageListUserActive, setPageListUserActive] = useState(1);
  const rowsPerPageListUserActive = 5;
  const pagesListUserActive = Math.ceil(
    activeUsers.length / rowsPerPageListUserActive
  );
  const paginatedListUserActive = React.useMemo(() => {
    const start = (pageListUserActive - 1) * rowsPerPageListUserActive;
    const end = start + rowsPerPageListUserActive;
    return activeUsers.slice(start, end);
  }, [pageListUserActive, activeUsers]);

  const calculateActiveDuration = (loginTime: number) => {
    if (!loginTime) return "N/A";

    const duration = currentTime - loginTime;

    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours}j ${minutes}m ${seconds}d`;
  };

  if (isCheckingAuth) {
    return <AlertCheckAuth />;
  }

  if (!user) {
    return <AlertLoginGuest />;
  }

  if (!isAuthorized) {
    return <AlertAuthorizedAdmin />;
  }

  return (
    <main className="flex flex-col justify-center w-full gap-3 p-4 mb-10">
      <>
        <p className="text-center text-xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-bold pb-2 pt-2 sm:pt-8">
          Selamat datang di Admin Panel, {user.displayName}👋
        </p>
        <div className="flex flex-col justify-center items-center gap-2 w-full sm:w-10/12 mx-auto text-sm outline outline-2 outline-emerald-200 rounded-lg mt-2">
          <p className="font-semibold text-base sm:text-xl pt-4">
            Manajemen Pengguna
          </p>
          <Table
            aria-label="Daftar Pengguna"
            radius="none"
            topContent={
              <div className="flex flex-row justify-between items-center">
                <p>Daftar Pengguna:</p>
                <Input
                  classNames={{
                    base: "max-w-[10rem] h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-default-300/20",
                  }}
                  placeholder="Cari Pengguna"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                  radius="sm"
                  startContent={<SearchIcon size={18} />}
                  type="search"
                />
              </div>
            }
            color="default"
            className="overflow-auto rounded-lg"
          >
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Tidak ada pengguna."}>
              {paginatedListUser.map((users, index) => (
                <TableRow key={users.uid}>
                  <TableCell>
                    {(pageListUser - 1) * rowsPerPageListUser + index + 1}
                  </TableCell>
                  <TableCell>{users.displayName}</TableCell>
                  <TableCell>{users.email}</TableCell>
                  <TableCell>
                    {user?.uid === users.uid ? (
                      <Select
                        disabled
                        size="small"
                        value={users.role}
                        className="capitalize"
                      >
                        <MenuItem value={users.role}>{users.role}</MenuItem>
                      </Select>
                    ) : (
                      <Select
                        size="small"
                        value={users.role}
                        onChange={(e) =>
                          handleChangeRole(users.uid, e.target.value as string)
                        }
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="registered">Registered</MenuItem>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-center mb-4">
            <Pagination
              isCompact
              size="sm"
              showControls
              color="primary"
              variant="flat"
              page={pageListUser}
              total={pagesListUser}
              onChange={(pageListUser) => setPageListUser(pageListUser)}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full sm:w-10/12 mx-auto text-sm outline outline-2 outline-emerald-200 rounded-lg mt-2">
          <p className="font-semibold text-base sm:text-xl pt-4">
            Monitoring Pengguna Aktif
          </p>
          <Table
            aria-label="Pengguna Aktif"
            radius="none"
            topContent="Pengguna Aktif:"
            color="default"
            className="overflow-auto rounded-lg"
          >
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>DURASI AKTIF</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Tidak ada pengguna aktif."}>
              {paginatedListUserActive.map((activeUser, index) => (
                <TableRow key={activeUser.uid}>
                  <TableCell>
                    {(pageListUserActive - 1) * rowsPerPageListUserActive +
                      index +
                      1}
                  </TableCell>
                  <TableCell>
                    {activeUser.displayName}
                    {user?.uid === activeUser.uid ? " (Saya)" : null}
                  </TableCell>
                  <TableCell>{activeUser.email}</TableCell>
                  <TableCell>
                    <p className="capitalize">{activeUser.role}</p>
                  </TableCell>
                  <TableCell>
                    {calculateActiveDuration(activeUser.loginTime)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-center mb-4">
            <Pagination
              isCompact
              showControls
              color="primary"
              variant="flat"
              size="sm"
              page={pageListUserActive}
              total={pagesListUserActive}
              onChange={(pageListUserActive) =>
                setPageListUserActive(pageListUserActive)
              }
            />
          </div>
        </div>
      </>
    </main>
  );
}
