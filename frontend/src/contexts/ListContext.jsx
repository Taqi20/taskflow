import { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";
import { HOST } from "../config/config";

const ListContext = createContext();

export const useListContext = () => {
    return useContext(ListContext);
}

export const ListProvider = ({ children }) => {
    const [ lists, setLists ] = useState([]);
    const [ selectedList, setSelectedList ] = useState(null);
    const [ latestListId, setLatestListId ] = useState(null);
    const [ selectedListName, setSelectedListName ] = useState("");
    const [ isNavColOpen, setIsNavColOpen ] = useState(true);
    const [ defaultList, setDefaultList ] = useState(null);

    const { fetchWithLoader } = useLoading();

    useEffect(() => {
        //fetching lists
        async function fetchData() {
            const fetchedLists = await getLists(`${HOST}/todolist/lists`);
            setLists(fetchedLists);
        }
        fetchData();
    }, []);

    async function getLists(url) {
        try {
            const response = await fetchWithLoader(url, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error in getLists: ${error.message}`);
        }
    }

    //setting up the selected list value 
    const selectList = (listId) => {
        const listToSelect = lists.find(lists => lists._id === listId);
        setSelectedList(listToSelect);
        setSelectedListName(listToSelect.title);
    };

    //get the default task list 
    async function getDefaultTasksList() {
        try {
            const response = await fetchWithLoader(`${HOST}/todolist/tasks`, {
                credentials: "iclude",
            });

            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error in getLists: ${error.message}`);
        }

        //add new list 
        const addNewList = async (title) => {
            try {
                const response = await fetchWithLoader(`${HOST}/todolist/new`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JOSN.stringify({ title }),
                });
                const newList = await response.json();

                //setLists(lists.concat(newList));
                setLists([ ...lists, newList ]);
                setLatestListId(newList._id);
                setSelectedList(newList._id);
            } catch (error) {
                console.error(error.message);
            }
        }
    }
}
