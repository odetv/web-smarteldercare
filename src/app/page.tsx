import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import LogoUndiksha from "@/assets/images/logo/LogoUndiksha.png";
import Logo from "../assets/images/logo/logo.gif";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center -mt-14 pt-10 sm:pt-0 gap-2 w-10/12 mx-auto">
      <div className="flex flex-col justify-center items-center gap-4">
        <p className="font-bold text-2xl lg:text-6xl text-center text-[#FF914D]">
          Smart Elder Care
        </p>
        <p className="text-sm sm:text-base text-center">
          Solusi Pemantauan serta Perawatan Lansia Berbasis IoT dan Website
          dengan pendekatan Deep Learning lahir sebagai solusi terkini yang
          menggabungkan teknologi Internet of Things (IoT) dan Artificial
          Intelengence (AI) serta dengan antarmuka Website untuk tampilan data
          yang didapat dari sensor-sensor.
        </p>
        <p className="font-bold text-base lg:text-lg text-center pb-2 text-[#058789]">
          - Smart Elder Care Peduli Lansia untuk Keluarga Penuh Cinta -
        </p>
      </div>
      <div className="mt-2 flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-center items-center gap-2 sm:gap-6 pb-4 sm:pb-6">
        <div className="flex flex-row justify-center items-center gap-2 sm:gap-6">
          <Popover placement="bottom" offset={10} showArrow>
            <PopoverTrigger>
              <div>
                <Image
                  width={72}
                  height={72}
                  style={{ height: "auto", width: 72 }}
                  className="transform hover:scale-105 transition-transform-opacity object-cover"
                  alt="Undiksha"
                  src={Logo.src}
                  priority={true}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2 text-center">
                <div className="text-small font-bold">Smart Elder Care</div>
                <div className="text-tiny">GEMASTIK 2024</div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="mt-1"
                >
                  <a target="_blank" href="/">
                    Kunjungi
                  </a>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover placement="bottom" offset={10} showArrow>
            <PopoverTrigger>
              <div>
                <Image
                  width={80}
                  height={80}
                  style={{ height: "auto", width: 72 }}
                  className="transform hover:scale-105 transition-transform-opacity object-cover"
                  alt="Undiksha"
                  src={LogoUndiksha.src}
                  priority={true}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2 text-center">
                <div className="text-small font-bold">Undiksha</div>
                <div className="text-tiny">Fakultas Teknik dan Kejuruan</div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="mt-1"
                >
                  <a target="_blank" href="https://undiksha.ac.id/">
                    Kunjungi
                  </a>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 w-10/12 lg:w-1/6 lg:max-w-5xl lg:grid-cols-1 gap-4">
        <Link
          href="/dashboard"
          className="bg-[#e9e8e8] group rounded-xl border border-transparent px-4 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="sm:text-xl font-bold">
            Get Started{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none pl-1">
              &rarr;
            </span>
          </h2>
          <p className="text-xs sm:text-sm opacity-50 pt-1">
            Explore Dashboard
          </p>
        </Link>
      </div>
    </main>
  );
}
