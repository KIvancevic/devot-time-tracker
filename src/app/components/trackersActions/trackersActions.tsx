import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import Start from "@/app/assets/play.svg";
import Stop from "@/app/assets/stop.svg";
import Resume from "@/app/assets/resume.svg";
import Pencil from "@/app/assets/edit.svg";
import Trash from "@/app/assets/delete.svg";
import { useAuthContext } from "@/context/AuthContext";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import deleteData from "@/firebase/deleteData";
import updateDescription from "@/firebase/updateDescription";

interface dataObject {
  id: string;
  createdAt: string;
  timeLogged: { hours: number; minutes: number; seconds: number };
  timestamp: number;
  description: string;
}

interface Tracker {
  id: string;
  description: string;
  timeLogged: string;
  createdAt: string;
  timestamp: number;
}

interface trackerActionProp {
  history?: boolean;
  rowId?: number;
  data: dataObject;
  trackers: Array<Tracker>;
}

const trackerAction: React.FC<trackerActionProp> = (props) => {
  const [startClicked, setStartClicked] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [isDeleteDialog, setIsDeleteDialogVisible] = useState<boolean>(false);
  const [timerActivated, setTimerActivated] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const {
    user,
    setStart,
    isTimerActive,
    setResume,
    stop,
    stopAll,
    setStop,
    setChangeDescription,
    setDeleteTimer,
  } = useAuthContext();

  const deleteTimer = async () => {
    setDeleteTimer(true);
    const { result, error } = await deleteData(user?.uid, props.data.id);
    if (result) console.log(result);
    if (error) console.log(error);
    setDeleteTimer(false);
  };

  const updateDescriptionHook = async () => {
    const { result, error } = await updateDescription(
      user?.uid,
      props.data.id,
      description
    );
    if (result) console.log(result);
    if (error) console.log(error);
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
          setIsDeleteDialogVisible(false);
          setDescription("");
        }}
        className="p-button-text"
      />
      {!isDeleteDialog ? (
        <Button
          label="Rename"
          icon="pi pi-check"
          onClick={() => {
            setVisible(false);

            updateDescriptionHook();
            setDescription("");
            setChangeDescription(true);
          }}
          autoFocus
        />
      ) : (
        <Button
          label="Delete"
          icon="pi pi-check"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            setIsDeleteDialogVisible(false);
            deleteTimer();
          }}
          autoFocus
        />
      )}
    </div>
  );

  useEffect(() => {
    if (!visible) setDescription("");
    if (stopAll) {
      setStop(false);
      setStartClicked(false);
      setStart(false);
      setResume(false);
      setTimerActivated(false);
    }
  }, [visible, stopAll]);

  return (
    <div
      className={
        !props.history
          ? "flex items-center -ms-2 justify-between"
          : "flex items-center -ms-2 justify-start"
      }
    >
      {!props.history && (
        <>
          {!startClicked ? (
            <Button
              rounded
              text
              onClick={() => {
                if (!isTimerActive) {
                  setStartClicked(true);
                  setStart(true);
                  setResume(false);
                  setTimerActivated(true);
                }
              }}
              icon={<Image src={Start} alt={"Start"} />}
            />
          ) : (
            <Button
              onClick={() => {
                if (isTimerActive) {
                  setStartClicked(false);
                  setStart(false);
                  setResume(true);
                }
              }}
              rounded
              text
              icon={<Image src={Resume} alt={"Resume"} />}
            />
          )}

          <Button
            onClick={() => {
              if (isTimerActive && timerActivated) {
                setStop(true);
                setStartClicked(false);
                setStart(false);
                setResume(false);
                setTimerActivated(false);
              }
            }}
            rounded
            text
            icon={<Image src={Stop} alt={"Stop"} />}
          />
        </>
      )}
      <Button
        rounded
        text
        icon={<Image src={Pencil} alt={"editDescription"} />}
        onClick={() => setVisible(true)}
      />
      <Dialog
        header={`Change tracker ${props.data.description}`}
        visible={visible}
        onHide={() => setVisible(false)}
        footer={footerContent}
        dismissableMask
      >
        <InputText
          value={description}
          type="text"
          className="p-inputtext-lg m-10"
          placeholder={`${props.data.description}`}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Dialog>
      <Button
        onClick={() => setIsDeleteDialogVisible(true)}
        rounded
        text
        icon={<Image src={Trash} alt={"delete"} />}
      />{" "}
      <Dialog
        header={`Delete tracker ${props.data.description}?`}
        visible={isDeleteDialog}
        onHide={() => setIsDeleteDialogVisible(false)}
        footer={footerContent}
        dismissableMask
      ></Dialog>
    </div>
  );
};

export default trackerAction;
