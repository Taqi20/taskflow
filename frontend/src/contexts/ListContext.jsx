import { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";
import { HOST } from "../config/config";

const ListContext = createContext();

export const useListContext = () => {
    return useContext(ListContext);
};

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
        const listToSelect = lists.find((list) => list._id === listId);
        setSelectedList(listToSelect);
        setSelectedListName(listToSelect.title);
    };

    //get the default task list 
    async function getDefaultTasksList() {
        try {
            const response = await fetchWithLoader(`${HOST}/todolist/tasks`, {
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

    //add new list 
    const addNewList = async (title) => {
        try {
            const response = await fetchWithLoader(`${HOST}/todolist/new`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });
            const newList = await response.json();

            //setLists(lists.concat(newList));
            setLists([ ...lists, newList ]);
            setLatestListId(newList._id);
            setSelectedList(newList._id);
        } catch (error) {
            console.error(error.message);
        }
    };

    //edit lis title 
    const editList = async (editedTitle, listId) => {
        try {
            const res = await fetchWithLoader(`${HOST}/todolist/updatetitle/${listId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editedTitle }),
            }
            );

            if (!res.ok) {
                throw new Error(`Failed to update list title (status ${res.status})`);
            }

            const data = await res.json();
            const newTitle = data.newTitle;

            setLists((prevLists) => {
                return prevLists.map((list) => {
                    if (list._id === listId) {
                        return { ...list, title: newTitle };
                    }
                    return list;
                });
            });

            selectList(listId);
            setSelectedListName(newTitle);

            return newTitle; //indicates success
        } catch (error) {
            console.error("Error editing list:", error);
            return false; // Indicate failure
        }
    };

    //delete a list

    const deleteList = async (listId) => {
        try {
            const res = await fetchWithLoader(`${HOST}/todolist/delete/${listId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to Delete the List (status ${res.status})`);
            }

            const data = await res.json();
            const deletedList = data.deletedList;
            const updatedList = lists.filter((list) => list._id !== deletedList._id);

            setLists(updatedList);
            if (deletedList._id === selectedList._id) {
                setSelectedList(null);
                setSelectedListName(null);
            }

        } catch (error) {
            console.error("Error deleting the list:", error);
        }
    };

    return (
        <ListContext.Provider
            value={{
                lists,
                selectedList,
                setSelectedList,
                getDefaultTasksList,
                selectList,
                addNewList,
                editList,
                deleteList,
                latestListId,
                setLatestListId,
                selectedListName,
                setSelectedListName,
                defaultList,
                setDefaultList,
                isNavColOpen,
                setIsNavColOpen,
            }}
        >
            {children}
        </ListContext.Provider>
    );
};
