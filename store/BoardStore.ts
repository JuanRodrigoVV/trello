import { databases, ID, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { Board, TypedColumn, Column, Todo, Image } from '@/typings';
import { create } from 'zustand'



interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    //search
    searchString: string;
    setSearchString: (searchString: string) => void;
   
    //task input
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;

   
    //image 
    image: File | null;
    setImage: (image: File | null) => void;

    //task type
    newTaskType: TypedColumn;
    setNewTaskType: (columnId: TypedColumn) => void;
    
    //delete task
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

    // add task
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;


}


export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },

  searchString: "",
  image: null,
  
  setSearchString: (searchString) => set({searchString}),
  
  //set new task type
  newTaskType: 'todo',
  setNewTaskType: (columnId: TypedColumn) => set ({newTaskType: columnId}),
  
  //new task input
  newTaskInput: "",
  setNewTaskInput: (input: string) => set ({newTaskInput: input}),

  getBoard: async() => {
    const board = await getTodosGroupedByColumn();
    set({ board }) ;

  }, 
  setBoardState: (board) => set({board}),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    // delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({board: {columns: newColumns}});

    // if (todo.image) {
    //   await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    // }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );

  },

  //set image
  setImage: (image: File |null) => set({image}),

  //update todo in dashboard
  
  updateTodoInDB: async(todo, columnId) => {
    await databases.updateDocument( 
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id, {
        title: todo.title,
        status: columnId,
      }

    )
  },
 

  //add task
 
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if(image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }
    const {$id} = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // Include image if it exists
        ...(file && {image: JSON.stringify(file)})
      }
    );

    set({newTaskInput: ''});

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // Include image if it exists
        ...(!file && { image: file }),
      };

      const column = newColumns.get(columnId);
      
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else 
      { newColumns.get(columnId)?.todos.push(newTodo);
      }
      
      return {
        board: {
          columns: newColumns,
        }
      }

    })
  }



}))