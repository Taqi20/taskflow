import { createContext, useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
const LoadingContext = createContext();

export function useLoading() {
    return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
    const [ loading, setLoading ] = useState(false);
    const [ sessionExpiredModalOpen, setSessionExpiredModalOpen ] = useState(false);

    //intercept fetch API throughtout the whole app;

    const fetchWithLoader = async (url, options) => {
        setLoading(true);
        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                setSessionExpiredModalOpen(true);
            }

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return response;
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSessionExpiredModalOpen(false);
        location.reload();
    };

    return (
        <LoadingContext.Provider value={{ loading, setLoading, fetchWithLoader }}>
            {/*modal to show when seesion expires*/}
            <Dialog
                open={sessionExpiredModalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Session Expired"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your Session has been Expired. Please Login Again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button
                        className="mx-auto bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-1 px-4 rounded-md"
                        onClick={handleClose}
                        autoFocus
                    >
                        OK
                    </button>

                </DialogActions>
            </Dialog>
            {children}
        </LoadingContext.Provider>
    );
}