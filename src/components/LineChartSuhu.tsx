"use client";
import { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import ImageIcon from "@mui/icons-material/Image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import { database } from "../../firebaseConfig";
import { get, onValue, ref } from "firebase/database";

export default function LineChartSuhu() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>("1d"); // Default 1 day
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datesRef = ref(database, "esp32");
        const datesSnapshot = await get(datesRef);
        if (datesSnapshot.exists()) {
          const datesData = datesSnapshot.val();
          const dates = Object.keys(datesData);

          // Filter dates based on the selected time range
          const filteredDates = filterDates(dates, timeRange);
          if (filteredDates.length === 0) {
            console.error("No data available for the selected time range.");
            return;
          }
          const latestDate = filteredDates.sort().reverse()[0];

          const dataRef = ref(database, `esp32/${latestDate}`);
          onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
              console.error("No data available for the latest date.");
              return;
            }
            const newChartData: number[] = [];
            const newLabels: string[] = [];

            const times = Object.keys(data)
              .sort()
              .reverse()
              .slice(0, 10)
              .reverse();

            times.forEach((time) => {
              newLabels.push(time);
              newChartData.push(parseFloat(data[time].sensor_suhu_air));
            });

            setLabels(newLabels);
            setChartData(newChartData);
            setTimestamp(`${latestDate} ${times[times.length - 1]}`);
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  const filterDates = (dates: string[], range: string) => {
    const now = new Date();
    let filteredDates = [];

    switch (range) {
      case "1d":
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(now.getDate() - 1);
        filteredDates = dates.filter((date) => new Date(date) >= oneDayAgo);
        break;
      case "7d":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        filteredDates = dates.filter((date) => new Date(date) >= sevenDaysAgo);
        break;
      case "1m":
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredDates = dates.filter((date) => new Date(date) >= oneMonthAgo);
        break;
      default:
        filteredDates = dates;
    }

    return filteredDates;
  };

  useEffect(() => {
    if (chartRef.current) {
      if ((chartRef.current as any).chart) {
        (chartRef.current as any).chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      if (context) {
        const newChart = new Chart(context, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Suhu (°C)",
                data: chartData,
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        (chartRef.current as any).chart = newChart;
      }
    }
  }, [chartData, labels]);

  function handleDownloadImageJPG() {
    if (chartRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = chartRef.current.width;
      canvas.height = chartRef.current.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(chartRef.current, 0, 0);
        const file = canvas.toDataURL("image/jpg");
        const link = document.createElement("a");
        link.href = file;
        link.download = "LineChartSuhu.jpg";
        link.click();
      }
    }
  }

  function handleDownloadImagePNG() {
    if (chartRef.current) {
      const file = chartRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = file;
      link.download = "LineChartSuhu.png";
      link.click();
    }
  }

  function handleDownloadExcel() {
    if (chartRef.current && (chartRef.current as any).chart) {
      const chart = (chartRef.current as any).chart;
      const data = [
        ["Waktu", "Suhu (°C)"],
        ...chart.data.labels.map((label: any, index: string | number) => [
          label,
          chart.data.datasets[0].data[index],
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SheetSuhu");
      XLSX.writeFile(workbook, "LineChartSuhu.xlsx");
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="text-xs flex flex-row items-center justify-start">
          <p className="pr-1 font-bold">Waktu:</p>
          <p>{timestamp ? timestamp : "-"}</p>
        </div>

        <Dropdown backdrop="transparent" radius="sm" className="p-1 mb-4">
          <DropdownTrigger>
            <Button variant="flat" color="primary" size="sm" radius="sm">
              Filter Waktu
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Filter Time Range">
            <DropdownItem onClick={() => setTimeRange("1d")} key="1d">
              1 Hari yang Lalu
            </DropdownItem>
            <DropdownItem onClick={() => setTimeRange("7d")} key="7d">
              7 Hari yang Lalu
            </DropdownItem>
            <DropdownItem onClick={() => setTimeRange("1m")} key="1m">
              1 Bulan yang Lalu
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <canvas className="" ref={chartRef} />
      <div className="flex flex-row gap-2 justify-center items-center pt-1">
        <Dropdown backdrop="transparent" radius="sm" className="p-1">
          <DropdownTrigger>
            <Button variant="flat" color="primary" size="sm" radius="sm">
              Chart Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Actions">
            <DropdownItem
              onClick={handleDownloadImagePNG}
              startContent={<ImageOutlinedIcon fontSize="small" />}
              key="png"
              color="default"
              variant="flat"
            >
              Simpan Gambar (.png)
            </DropdownItem>
            <DropdownItem
              onClick={handleDownloadImageJPG}
              startContent={<ImageIcon fontSize="small" />}
              key="jpg"
              color="default"
              variant="flat"
            >
              Simpan Gambar (.jpg)
            </DropdownItem>
            <DropdownItem
              onClick={handleDownloadExcel}
              startContent={<InsertDriveFileIcon fontSize="small" />}
              key="excel"
              color="default"
              variant="flat"
            >
              Simpan File Excel (.xlsx)
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
