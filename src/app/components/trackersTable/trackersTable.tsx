"use client";
import React, { useEffect, useState, useRef } from "react";
import addData from "@/firebase/addData";
import dynamic from "next/dynamic";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { Toast as ToastType } from "primereact/toast";
import { Button } from "primereact/button";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuidv4 } from "uuid";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
import StopWatch from "@/app/assets/stopWatch.svg";
import Calendar from "@/app/assets/calendar.svg";
import Stop from "@/app/assets/stop.svg";
import FirstPage from "@/app/assets/firstPage.svg";
import PreviousPage from "@/app/assets/previousPage.svg";
import NextPage from "@/app/assets/nextPage.svg";
import LastPage from "@/app/assets/lastPage.svg";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import StopIcon from "@/app/components/icons/stop";
import { InputText } from "primereact/inputtext";

const TimeTracker = dynamic(
  () => import("@/app/components/timeTracker/timeTracker")
);

const TrackersAction = dynamic(
  () => import("@/app/components/trackersActions/trackersActions")
);

interface Tracker {
  id: string;
  description: string;
  timeLogged: string;
  createdAt: string;
  timestamp: number;
}

function TrackersTable() {
  const {
    user,
    setTimerId,
    setStopAll,
    deleteTimer,
    changeDescription,
    setChangeDescription,
  } = useAuthContext();
  const toastRef = useRef<ToastType>(null);
  const router = useRouter();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [trackerAdded, setTrackerAdded] = useState<boolean>(false);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(3);
  const [visible, setVisible] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const trackersSorted = trackers.sort((a, b) => b.timestamp - a.timestamp);

  function getCurrentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const todayDate = getCurrentDate();

  const addNewTimer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentDate = new Date();
    const timestamp = Date.now();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    const formattedDate = `${day}.${month}.${year}.`;
    const data = {
      description: description,
      timeLogged: { hours: 0, minutes: 0, seconds: 0 },
      createdAt: formattedDate,
      timestamp: timestamp,
    };
    const { result, error } = await addData(user?.uid, uuidv4(), data);
    if (toastRef.current) {
      toastRef.current.show({
        severity: "success",
        summary: "Tracker saved",
        detail: "You have successfully added tracker.",
      });
    }
    if (error) {
      return console.error(error);
    }
    setTrackerAdded(!trackerAdded);
    getData();
  };

  const getData = async () => {
    if (user) {
      const querySnapshot = await getDocs(collection(db, user.uid));
      const data: Tracker[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Tracker);
      });

      return setTrackers(data);
    }
  };

  useEffect(() => {
    if (user === null) router.push("/");
  }, [user]);

  useEffect(() => {
    getData();
    setChangeDescription(false);
  }, [deleteTimer, changeDescription]);

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
          setDescription("");
        }}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          setVisible(false);
          setDescription("");
          addNewTimer(e);
        }}
        autoFocus
      />
    </div>
  );

  useEffect(() => {
    if (!visible) setDescription("");
  }, [visible]);

  return (
    <>
      <p className="text-[24px] font-bold nunito text-[#0C0D25] flex">
        <Image src={Calendar} alt="stopwatch" className="mr-3" />
        Today ({todayDate})
      </p>

      <div className="flex justify-end gap-3 mb-5 mt-10">
        <Button
          type="submit"
          className="bg-[#FF5722] border-none h-[36px] nunito font-bold pr-2.5"
          onClick={() => setVisible(true)}
        >
          <Image src={StopWatch} alt="stopwatch" className="mr-2" />
          Start a new timer
        </Button>
        <Dialog
          header="Enter Tracker Description"
          visible={visible}
          onHide={() => setVisible(false)}
          footer={footerContent}
          dismissableMask
        >
          <InputText
            value={description}
            type="text"
            className={"p-input text-lg m-10"}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Dialog>
        <Button
          onClick={() => setStopAll(true)}
          className="bg-[#181846] border-none h-[36px] nunito font-bold pr-2.5"
        >
          <StopIcon className="mr-2" color="white" />
          Stop all
        </Button>
      </div>

      <DataTable
        value={trackersSorted}
        tableStyle={{ minWidth: "50rem" }}
        showGridlines
        rows={rows}
        first={first}
        rowsPerPageOptions={[5, 10, 25, 50]}
        lazy
        loading={!trackersSorted ? true : false}
      >
        <Column
          field="timeLogged"
          header="Time logged"
          className="w-1/5 nunito text-[#5F6B8A] font-bold h-[70px]"
          headerClassName="nunito font-bold text-[#0C0D25] text-lg h-[70px]"
          body={(data, props) => (
            <TimeTracker
              rowId={props.rowIndex}
              data={data}
              trackers={trackers}
            />
          )}
        />
        <Column
          field="description"
          header="Description"
          className=" w-2/4 nunito text-[#5F6B8A] font-semibold  h-[70px]"
          headerClassName=" nunito font-bold  text-[#0C0D25] text-lg h-[70px]"
        ></Column>
        <Column
          field="Actions"
          header="Actions"
          className="w-[5%] nunito text-[#5F6B8A] font-semibold h-[70px] "
          headerClassName="nunito font-bold  text-[#0C0D25] text-lg h-[70px]"
          body={(data, props) => (
            <span onClick={() => setTimerId(props.rowIndex)}>
              <TrackersAction
                rowId={props.rowIndex}
                data={data}
                trackers={trackers}
              />
            </span>
          )}
        />
      </DataTable>
      <Paginator
        className="mt-20"
        firstPageLinkIcon={
          <Image src={FirstPage} alt="first page" className="cursor-pointer" />
        }
        prevPageLinkIcon={
          <Image
            src={PreviousPage}
            alt="previous page"
            className="cursor-pointer"
          />
        }
        nextPageLinkIcon={
          <Image src={NextPage} alt="next page" className="cursor-pointer" />
        }
        lastPageLinkIcon={
          <Image src={LastPage} alt="last page" className="cursor-pointer" />
        }
        rows={rows}
        first={first}
        totalRecords={trackersSorted.length}
        onPageChange={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        template={
          "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        }
      />

      <Toast ref={toastRef} />
    </>
  );
}
export default TrackersTable;
