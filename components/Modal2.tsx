'use client';

import { useState, Fragment, useRef, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Modal() {

  const imagePickerRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
    
  ])

  const [newTaskInput, newTaskType, setNewTaskInput] = useBoardStore((state) => [
    state.newTaskInput,
    state.setNewTaskInput,
   
   
    state.newTaskType
  ]);

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!newTaskInput) return;
    
  //   // addTask(newTaskInput, newTaskType, image);
  //   // setImage(null);
  //   closeModal();
  //   // add task
  // }

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form"
      // onSubmit={handleSubmit}
      className='relative z-10'
      onClose={closeModal}>
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex items-center min-h-full justify-center p-4 text-center'>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          >
         <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
            <Dialog.Title
            as='h3'
            className='text-lg font-medium leading-6 text-gray-900 pb-2'
            >
            Add Task
            <div>
             <input
             type='text'
             value={newTaskInput}
             onChange={(e) => setNewTaskInput(e.target.value)}
             placeholder="Enter your task"
             className='w-full border border-gray-300 rounded-md outline-none p-5'
             />  
            </div>  
            <TaskTypeRadioGroup/>
            <div>
              <div>

                <button 
                  type='button'
                  onClick={() => {imagePickerRef.current?.click()}}
                  className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
                  <PhotoIcon className='h-6 2-6 mr-2 inline-block'/>
                  Upload Image
                </button>

                {/* {image && (
                  <Image 
                    alt="Upload Image"
                    width={200}
                    height={200}
                    src={URL.createObjectURL(image)}

                    onClick={() => {
                      setImage(null);
                    }}
                  />
                )} */}
              </div>
              {/* <input type="file"
              ref={imagePickerRef}
              hidden
              onChange={(e) => {
                //check e is an image
                if (!e.target.files![0].type.startsWith('image/')) return;
                setImage(e.target.files![0])
              }} /> */}
            </div>
              </Dialog.Title>

              <div>
                <button
                  type='submit'
                  disabled={!newTaskInput}
                  className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                  text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                  disabled:cursor-not-allowed'>
                  Add Task
                </button>
              </div>
            

           
          </Dialog.Panel>
        </Transition.Child>
            
                      </div>
            
                    </div>
      </Dialog>
    </Transition>
  )
}
