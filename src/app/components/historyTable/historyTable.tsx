"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Calendar } from "primereact/calendar";
import { Calendar as CalendarType } from "primereact/calendar";
import FirstPage from "@/app/assets/firstPage.svg";
import PreviousPage from "@/app/assets/previousPage.svg";
import NextPage from "@/app/assets/nextPage.svg";
import LastPage from "@/app/assets/lastPage.svg";
import { InputText } from "primereact/inputtext";
import Close from "@/app/assets/close.svg";
import Image from "next/image";
import CalendarIcon from "@/app/assets/calendar.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import dynamic from "next/dynamic";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

interface Tracker {
  id: string;
  description: string;
  timeLogged: string;
  createdAt: string;
  timestamp: number;
}

const TrackersAction = dynamic(
  () => import("@/app/components/trackersActions/trackersActions")
);

const HistoryTable = () => {
  const {
    user,
    setTimerId,
    setChangeDescription,
    deleteTimer,
    changeDescription,
  } = useAuthContext();
  const router = useRouter();
  const startDateDialogRef = useRef<CalendarType>(null);
  const endDateDialogRef = useRef<CalendarType>(null);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [trackersByStartAndEndDate, setTrackersByStartAndEndDate] = useState<
    Tracker[]
  >([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(3);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTimestamp, setStartTimestamp] = useState<number>(0);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTimestamp, setEndTimestamp] = useState<number>(0);
  const [searchDescription, setSearchDescription] = useState<string>("");
  const trackersSorted = trackers.sort((a, b) => b.timestamp - a.timestamp);

  const showStartDateDialog = () => {
    if (startDateDialogRef.current) {
      startDateDialogRef.current.show();
    }
  };

  const sortBySearch = (inputString: string) => {
    const inputStringLower = inputString.toLowerCase();

    return trackersSorted.filter((obj) =>
      Object.values(obj).some(() => {
        if (typeof obj.description === "string") {
          const descriptionLower = obj.description.toLowerCase();
          return descriptionLower.includes(inputStringLower);
        }
      })
    );
  };

  const sortByStartEndAndSearch = (inputString: string) => {
    const inputStringLower = inputString.toLowerCase();
    return trackersByStartAndEndDate.filter((obj) =>
      Object.values(obj).some(() => {
        if (typeof obj.description === "string") {
          const descriptionLower = obj.description.toLowerCase();
          return descriptionLower.includes(inputStringLower);
        }
      })
    );
  };

  const isSortedBySearch = sortBySearch(searchDescription);
  const isSortedByStartEndAndSearch =
    sortByStartEndAndSearch(searchDescription);

  const filteredBySortAndEndDate = () => {
    return trackers
      .filter(
        (item) =>
          item.timestamp >= startTimestamp && item.timestamp <= endTimestamp
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const showEndDateDialog = () => {
    if (endDateDialogRef.current) {
      endDateDialogRef.current.show();
    }
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
    getData();
    setChangeDescription(false);
    const sortedByStartAndEndDate = filteredBySortAndEndDate();
    setTrackersByStartAndEndDate(sortedByStartAndEndDate);
  }, [
    user,
    deleteTimer,
    changeDescription,
    endTimestamp,
    startTimestamp,
    searchDescription,
  ]);

  return (
    <div className="p-28">
      <p className="text-[24px] font-bold nunito text-[#0C0D25] flex">
        Trackers History
      </p>
      <div className="flex justify-around items-center bg-[#F9F9FD] h-[111px] mt-10">
        <div className="flex flex-col">
          <label
            htmlFor="startDate"
            className="text-[#5F6B8A] text-sm ms-2 nunito"
          >
            Start date
          </label>
          <div className="flex flex-row bg-white passwordInput rounded mt-1">
            <Calendar
              ref={startDateDialogRef}
              visible={true}
              value={startDate}
              dateFormat="dd.mm.yy"
              className="ms-2 nunito"
              inputId="startDate nunito"
              placeholder="Select start date"
              inputClassName="outline-none border-none shadow-none"
              onChange={(e: any) => {
                {
                  setStartDate(e.value as Date);
                  setStartTimestamp(e.value.getTime());
                }
              }}
            />

            <Image
              src={CalendarIcon}
              alt="calendar"
              height={16}
              width={16}
              onClick={() => showStartDateDialog()}
              className="cursor-pointer mr-2 "
            />
          </div>
        </div>
        <div className="flex flex-col ">
          <label
            htmlFor="endDate"
            className="text-[#5F6B8A] text-sm ms-2 nunito"
          >
            End date
          </label>
          <div className="flex flex-row passwordInput rounded mt-1 bg-white">
            <Calendar
              ref={endDateDialogRef}
              name="End Date"
              value={endDate}
              className="ms-2 nunito grow"
              placeholder="Select start date"
              inputId="endDate"
              inputClassName="outline-none border-none shadow-none"
              onChange={(e: any) => {
                setEndDate(e.value as Date);
                setEndTimestamp(e.value.getTime());
              }}
              dateFormat="dd.mm.yy"
            />
            <Image
              src={CalendarIcon}
              alt="calendar"
              height={16}
              width={16}
              className="cursor-pointer mr-2"
              onClick={() => showEndDateDialog()}
            />
          </div>
        </div>

        <div className="flex flex-col  p-input-icon-right ms-2">
          <label
            htmlFor="description"
            className="text-[#5F6B8A] text-sm ms-2 nunito"
          >
            Description contains
          </label>
          <div className="flex flex-row bg-white passwordInput rounded">
            <InputText
              id="description"
              placeholder="Search"
              className="outline-none ms-2 nunito border-none shadow-none"
              value={searchDescription}
              onChange={(e) => {
                setSearchDescription(e.target.value);
                sortBySearch(searchDescription);
              }}
            />
            <Image
              src={Close}
              alt="close"
              onClick={() => setSearchDescription("")}
              className="cursor-pointer me-3"
            />
          </div>
        </div>
      </div>

      <DataTable
        className="mt-5"
        value={
          trackersByStartAndEndDate.length && searchDescription != ""
            ? isSortedByStartEndAndSearch
            : trackersByStartAndEndDate.length
            ? trackersByStartAndEndDate
            : isSortedBySearch
            ? isSortedBySearch
            : trackers
        }
        tableStyle={{ minWidth: "50rem" }}
        showGridlines
        rows={rows}
        first={first}
        rowsPerPageOptions={[5, 10, 25, 50]}
        lazy
        loading={!trackersSorted ? true : false}
      >
        <Column
          field="date"
          header="Date"
          className="w-1/5 nunito text-[#5F6B8A] font-bold h-[70px]"
          headerClassName="nunito font-bold text-[#0C0D25] text-lg h-[70px]"
          body={(data) => (
            <p onClick={() => console.log(data)} className="font-semibold">
              {data.createdAt}
            </p>
          )}
        />
        <Column
          field="description"
          header="Description"
          className=" w-2/4 nunito text-[#5F6B8A] font-semibold  h-[70px]"
          headerClassName=" nunito font-bold  text-[#0C0D25] text-lg h-[70px]"
        ></Column>
        <Column
          field="timeLogged"
          header="Time tracked"
          className=" w-1/12 nunito text-[#5F6B8A] font-semibold  h-[70px]"
          headerClassName=" nunito font-bold  text-[#0C0D25] text-lg h-[70px]"
          body={(data) => (
            <div>
              {`${String(data.timeLogged.hours).padStart(2, "0")}:${String(
                data.timeLogged.minutes
              ).padStart(2, "0")}:${String(data.timeLogged.seconds).padStart(
                2,
                "0"
              )}`}
            </div>
          )}
        />
        <Column
          field="Actions"
          header="Actions"
          className="w-1/12 nunito text-[#5F6B8A] font-semibold h-[70px] "
          headerClassName="nunito font-bold  text-[#0C0D25] text-lg h-[70px]"
          body={(data, props) => (
            <span onClick={() => setTimerId(props.rowIndex)}>
              <TrackersAction
                rowId={props.rowIndex}
                data={data}
                trackers={trackersSorted}
                history
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
    </div>
  );
};

export default HistoryTable;
