"use client";

import { ITask } from "@/types/task";
import { useEffect, useRef, useState } from "react";
import TableSkeleton from "./tableSkeleton";
import {
  closestCenter,
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskTableRow from "./taskTableRow";
import Image from "next/image";
import Alerts from "../alerts/alerts";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

const TaskTable = () => {
  const scrollTasksDiv = useRef<HTMLDivElement>(null);

  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task`,
      );
      if (!response.ok) {
        throw new Error("Ocorreu um problema, tente novamente.");
      }
      const returnedTasks = await response.json();

      setTaskList((prev) => {
        const sortedTasks = returnedTasks.sort(
          (a: ITask, b: ITask) => a.displayOrder - b.displayOrder,
        );

        console.log(sortedTasks);
        return sortedTasks;
      });
    } catch (error) {
      console.error("Fetching error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTaskPosition = (id: number) =>
    taskList.findIndex((task) => task.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTaskList((prev) => {
      const originPosition = getTaskPosition(active.id);
      const newPosition = getTaskPosition(over.id);

      const reordenedTaskList = arrayMove(prev, originPosition, newPosition);

      const updatedTaskList = reordenedTaskList.map((task, index) => ({
        ...task,
        displayOrder: index + 1,
      }));

      updateDisplayOrderOnDB(updatedTaskList);

      return updatedTaskList;
    });
  };

  const updateDisplayOrderOnDB = async (tasks: ITask[]) => {
    console.log(tasks);
    const TaskIdAndDisplay = tasks.map(({ id, displayOrder }) => ({
      id,
      displayOrder,
    }));

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/updateDisplayOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(TaskIdAndDisplay),
        },
      );
    } catch (error) {
      console.error("Erro ao atualizar as tarefas:", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const scrollLeft = () => {
    if (scrollTasksDiv.current) {
      scrollTasksDiv.current.scrollBy({ left: -60, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollTasksDiv.current) {
      scrollTasksDiv.current.scrollBy({ left: 60, behavior: "smooth" });
    }
  };

  const scrollUp = () => {
    if (scrollTasksDiv.current) {
      scrollTasksDiv.current.scrollBy({ top: -60, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollTasksDiv.current) {
      scrollTasksDiv.current.scrollBy({ top: 60, behavior: "smooth" });
    }
  };

  return (
    <div className="relative max-h-[calc(100dvh-180px)] max-w-full overflow-y-clip rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-row justify-between gap-4 pb-4">
        <button
          onClick={() => {
            fetchTasks();
          }}
          className="text-md group inline-flex w-fit items-center justify-center rounded-md bg-gray-3 px-3 py-2 text-center font-medium text-black hover:bg-opacity-90 dark:bg-meta-4 dark:text-gray-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:rotate-[30deg] group-focus:rotate-[360deg]"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 12a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.7 6.7 0 0 1 11 19c-6.24 0-9.36-7.54-4.95-11.95S18 5.77 18 12h-3l4 4h.1l3.9-4h-3a9 9 0 0 0-18 0"
            />
          </svg>
        </button>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : taskList.length > 0 ? (
        <div className="flex flex-col">
          <div
            className="relative max-h-[calc(100dvh-345px)] max-w-full overflow-auto"
            ref={scrollTasksDiv}
          >
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <table className=" min-w-full max-w-full table-auto overflow-hidden">
                <thead className="sticky top-0">
                  <tr className="border border-gray-2 bg-gray-2 text-left dark:border-gray-2/20 dark:bg-meta-4">
                    <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[220px] md:pl-9 xl:pl-11">
                      ID
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[150px]">
                      Nome
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[120px]">
                      Custo
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Data Limite
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Opções
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <SortableContext
                    items={taskList}
                    strategy={verticalListSortingStrategy}
                  >
                    {taskList.map((task, index) => (
                      <TaskTableRow
                        task={task}
                        key={index}
                        taskList={taskList}
                        setTaskList={setTaskList}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            {taskList.length > 0 ? (
              <button
                onClick={() => {
                  Alerts.showAddTask({ setTaskList });
                }}
                className="text-md inline-flex w-fit items-center justify-center rounded-md bg-meta-3 px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"
                  />
                </svg>
                Tarefa
              </button>
            ) : (
              ""
            )}
            <div className="flex items-center lg:hidden">
              <button onClick={scrollLeft} className="mr-2">
                <ChevronLeft size={40} />
              </button>
              <button onClick={scrollRight}>
                <ChevronRight size={40} />
              </button>
              <button onClick={scrollUp} className="mr-2">
                <ChevronUp size={40} />
              </button>
              <button onClick={scrollDown}>
                <ChevronDown size={40} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-start justify-center bg-white text-center  dark:bg-boxdark">
          <div className="flex flex-row items-center justify-center gap-14 py-3 lg:gap-16 xl:gap-18 2xl:gap-20">
            <div className="flex flex-col gap-8">
              <h2 className="text-dark col-6 flex justify-end text-start text-2xl font-semibold dark:text-white">
                NENHUMA TAREFA <br />
                FOI ENCONTRADA!
              </h2>
              <button
                onClick={() => {
                  Alerts.showAddTask({ setTaskList });
                }}
                className="text-md inline-flex w-fit items-center justify-center rounded-md bg-meta-3 px-5 py-3 text-center text-2xl font-medium text-white hover:bg-opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-[-10%]"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"
                  />
                </svg>
                Tarefa
              </button>
            </div>

            <div className="col-6 flex justify-start">
              <Image
                src="/images/illustration/add-files-01.svg"
                alt="add-item img"
                height={300}
                width={300}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
