import React from 'react'
import { ListProvider } from '../contexts/ListContext'
import { TodoProvider } from '../contexts/TodoContext'
// import { NavigationCol } from '../components/NavigationCol';
import TodosDisplay from '../components/TodosDisplay';


function TodoApp() {
    return (
        <div>
            <ListProvider>
                <TodoProvider>
                    <div className='flex h-screen w-screen bg-slate-200'>
                        {/* <NavigationCol /> */}
                        <TodosDisplay />
                    </div>
                </TodoProvider>
            </ListProvider>
        </div>
    )
}

export default TodoApp