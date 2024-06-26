import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { app, storage } from "../../firebaseConfig";
import {
  getAuth,
  updateProfile,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const useUserAuthentication = () => {
  const router = useRouter();

  const afterOut = "/";
  const auth = getAuth(app);

  const [fullName, setdisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [photoProfile, setPhotoProfile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  const ADMIN_EMAILS =
    process.env.NEXT_PUBLIC_VERCEL_ADMIN_EMAILS?.split(",") ?? [];

  const isAdmin = (email: string | null): boolean => {
    return email ? ADMIN_EMAILS.includes(email) : false;
  };

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
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const destination = isAdmin(result.user.email)
          ? "/admin"
          : "/dashboard";
        router.push(destination);
      }
    } catch (error: any) {
      console.error("Error signing in with Google", error.message);
    }
  };

  const handleSignInWithEmailAndPassword = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        const destination = isAdmin(result.user.email)
          ? "/admin"
          : "/dashboard";
        router.refresh();
        setTimeout(() => {
          router.push(destination);
        }, 500);
      }
    } catch (error: any) {
      console.error("Error signing in with email and password", error.message);
      setError("Email atau password salah. Silakan coba lagi!");
    }
  };

  const handleSignUpWithEmailAndPassword = async (
    email: string,
    password: string,
    fullName: string,
    confirmPassword: string
  ) => {
    try {
      if (!validateName(fullName)) {
        throw new Error("Nama tidak boleh mengandung karakter selain abjad!");
      }
      if (!validateEmail(email)) {
        throw new Error("Alamat Email tidak valid!");
      }
      if (!validatePassword(password)) {
        throw new Error(
          "Password minimal 8 karakter, mengandung huruf besar dan kecil, angka, serta simbol!"
        );
      }
      if (!validateConfirmPassword(confirmPassword)) {
        throw new Error(
          "Password minimal 8 karakter, mengandung huruf besar dan kecil, angka, serta simbol!"
        );
      }
      if (password !== confirmPassword) {
        throw new Error("Konfirmasi Password Tidak Cocok!");
      }
      if (!photoProfile) {
        throw new Error("Foto profil tidak boleh kosong!");
      }
      await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: fullName });
        if (photoProfile) {
          const storageRef = ref(
            storage,
            `user/photoProfile/${currentUser.uid}`
          );
          await uploadBytes(storageRef, photoProfile);
          const downloadURL = await getDownloadURL(storageRef);
          setProfileImageUrl(downloadURL);
          await updateProfile(currentUser, { photoURL: downloadURL });
        }
      }

      if (currentUser && currentUser.email) {
        const destination = isAdmin(currentUser.email)
          ? "/admin"
          : "/dashboard";
        router.refresh();
        setTimeout(() => {
          router.push(destination);
        }, 500);
      } else {
        setError("Tidak dapat mendapatkan email pengguna.");
      }
    } catch (error: any) {
      console.error("Error signing up with email and password", error.message);
      setError(error.message);
    }
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      try {
        validatePhoto(selectedFile);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setPreviewUrl(reader.result as string);
            setIsPhotoSelected(true);
          }
        };
        reader.readAsDataURL(selectedFile);
        setPhotoProfile(selectedFile);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      throw new Error("Nama Lengkap tidak boleh kosong!");
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      throw new Error("Alamat email tidak boleh kosong!");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      throw new Error("Password tidak boleh kosong!");
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword.trim()) {
      throw new Error("Konfirmasi Password tidak boleh kosong!");
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(confirmPassword);
  };

  const validatePhoto = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Harap unggah file gambar (png, jpeg, jpg)!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push(afterOut);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return {
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
    handleLogout,
  };
};
