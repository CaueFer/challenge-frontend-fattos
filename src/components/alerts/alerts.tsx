import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import AddTaskForm from "../forms/addTaskForm";
import { Dispatch, SetStateAction } from "react";
import { ITask } from "@/types/task";
import EditTaskForm from "../forms/editTaskForm";

const showInfo = (title: string, text: string) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "info",
    confirmButtonText: "OK",
    customClass: {
      popup: "bg-white dark:bg-boxdark dark:text-white",
      confirmButton: "bg-primary font-medium text-gray hover:bg-opacity-90",
    },
  });
};

const showError = (title: string, text: string) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "error",
    confirmButtonText: "OK",
    customClass: {
      popup: "bg-white dark:bg-boxdark  dark:text-white",
      confirmButton: "bg-primary font-medium text-gray hover:bg-opacity-90",
    },
  });
};

const showSuccess = (title: string, text: string) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      popup: "bg-white dark:bg-boxdark dark:text-white",
      confirmButton: "bg-primary font-medium text-gray hover:bg-opacity-90",
    },
  });
};

type showAddTaskProps = {
  setTaskList: Dispatch<SetStateAction<ITask[]>>;
};
const showAddTask = ({ setTaskList }: showAddTaskProps) => {
  const container = document.createElement("div");

  Swal.fire({
    html: container,
    showCloseButton: false,
    showConfirmButton: false,
    showCancelButton: false,
    focusConfirm: false,
    customClass: {
      popup: "bg-white dark:bg-boxdark overflow-y-auto",
    },
    willOpen: () => {
      ReactDOM.render(
        <AddTaskForm onClose={() => Swal.close()} setTaskList={setTaskList} />,
        container,
      );
    },
  });
};

type showEditTaskProps = {
  id: number;
  setTaskList: Dispatch<SetStateAction<ITask[]>>;
};
const showEditTaskForm = ({ id, setTaskList }: showEditTaskProps) => {
  const container = document.createElement("div");

  Swal.fire({
    html: container,
    showCloseButton: false,
    showConfirmButton: false,
    showCancelButton: false,
    focusConfirm: false,
    customClass: {
      popup: "bg-white dark:bg-boxdark overflow-y-auto",
    },
    willOpen: () => {
      ReactDOM.render(
        <EditTaskForm
          onClose={() => Swal.close()}
          id={id}
          setTaskList={setTaskList}
        />,
        container,
      );
    },
  });
};

const showDeleteTask = async (onConfirm: () => Promise<void>) => {
  const result = await Swal.fire({
    title: "Deletar",
    text: `Você realmente deseja deletar?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "bg-white dark:bg-boxdark dark:text-white",
      confirmButton: "bg-red-600 text-white hover:bg-red-500",
      cancelButton:
        "flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white",
    },
  });

  if (result.isConfirmed) {
    await onConfirm();
    showSuccess("Deletado", "A tarefa foi deletada com sucesso!");
  } else {
    showInfo("Cancelado", "A tarefa não foi deletada.");
  }
};

const Alerts = {
  showInfo,
  showError,
  showSuccess,
  showAddTask,
  showDeleteTask,
  showEditTaskForm,
};

export default Alerts;
