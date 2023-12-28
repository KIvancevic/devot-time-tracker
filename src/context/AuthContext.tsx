import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { ProgressSpinner } from "primereact/progressspinner";

const auth = getAuth(firebase_app);

interface AuthContextProps {
  user: User | null;
  currentPath: string | undefined;
  start: boolean;
  resume: boolean;
  stop: boolean;
  stopAll: boolean;
  deleteTimer: boolean;
  changeDescription: boolean;
  addNewTimer: boolean;
  newDescription: string;
  setStart: Dispatch<SetStateAction<boolean>>;
  setResume: Dispatch<SetStateAction<boolean>>;
  setStop: Dispatch<SetStateAction<boolean>>;
  setStopAll: Dispatch<SetStateAction<boolean>>;
  setDeleteTimer: Dispatch<SetStateAction<boolean>>;
  setChangeDescription: Dispatch<SetStateAction<boolean>>;
  setAddNewTimer: Dispatch<SetStateAction<boolean>>;
  setNewDescription: Dispatch<SetStateAction<string>>;
  timerId: number | undefined;
  setTimerId: Dispatch<SetStateAction<number | undefined>>;
  isTimerActive: boolean;
  setIsTimerActive: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  currentPath: undefined,
  start: false,
  resume: false,
  stop: false,
  stopAll: false,
  deleteTimer: false,
  changeDescription: false,
  addNewTimer: false,
  newDescription: "",
  setStart: () => false,
  setResume: () => false,
  setStop: () => false,
  setStopAll: () => false,
  setDeleteTimer: () => false,
  setChangeDescription: () => false,
  setAddNewTimer: () => false,
  setNewDescription: () => false,
  timerId: undefined,
  setTimerId: () => false,
  isTimerActive: false,
  setIsTimerActive: () => false,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [start, setStart] = useState<boolean>(false);
  const [resume, setResume] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [stopAll, setStopAll] = useState<boolean>(false);
  const [deleteTimer, setDeleteTimer] = useState<boolean>(false);
  const [changeDescription, setChangeDescription] = useState<boolean>(false);
  const [addNewTimer, setAddNewTimer] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const [timerId, setTimerId] = useState<number | undefined>(undefined);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPath,
        start,
        setStart,
        resume,
        setResume,
        stop,
        stopAll,
        setStop,
        setStopAll,
        deleteTimer,
        setDeleteTimer,
        changeDescription,
        setChangeDescription,
        addNewTimer,
        setAddNewTimer,
        newDescription,
        setNewDescription,
        timerId,
        setTimerId,
        isTimerActive,
        setIsTimerActive,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <ProgressSpinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
