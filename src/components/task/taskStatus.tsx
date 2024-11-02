import { ITask } from "@/types/task";
import React from "react";

type TaskStatusProps = {
  task: ITask;
};

const TaskStatus = ({ task }: TaskStatusProps) => {
  const currentDate = new Date();
  const deadlineDate = new Date(task.deadline);
  const diffTime = deadlineDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // CONVERTE PARA DIAS

  function formatDateToDDMMYYYY(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  const formattedDate = formatDateToDDMMYYYY(task.deadline); // FORMATA A DATA PARA FORMATO BRASIL

  let bgClass;
  if (diffDays < -7) {
    // Mais de uma semana atrás
    bgClass = "bg-danger text-danger";
  } else if (diffDays < 0) {
    // Menos de uma semana atrás
    bgClass = "bg-warning text-warning";
  } else {
    // De hoje em diante
    bgClass = "bg-success text-success dark:bg-meta-3/20 text-meta-3";
  }

  return (
    <p
      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${bgClass}`}
    >
      {formattedDate}
    </p>
  );
};

export default TaskStatus;
