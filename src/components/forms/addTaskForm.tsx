"use client";
import { DollarSign, Tag } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DatePicker from "../Inputs/datePicker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITask } from "@/types/task";
import Alerts from "../alerts/alerts";

const addTaskSchema = z.object({
  name: z.string().min(4, { message: "O nome está muito simples" }).max(20, {
    message: "O nome da tarefa não pode ter mais de 20 caracteres",
  }),
  price: z.number().min(0, "Preço deve ser um número positivo"),
  deadline: z
    .string()
    .nullable()
    .refine((value) => value && !isNaN(Date.parse(value)), {
      message: "Selecione uma data válida",
    }),
});

type FormData = z.infer<typeof addTaskSchema>;

type AddTaskFormProps = {
  onClose: () => void;
  setTaskList: Dispatch<SetStateAction<ITask[]>>;
};

function AddTaskForm({ onClose, setTaskList }: AddTaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      name: "",
      price: 0,
      deadline: selectedDate,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar a tarefa");
      }

      const responseData: ITask = await response.json();
      console.log(responseData);

      Alerts.showSuccess("Sucesso", "Tarefa foi adicionada com sucesso!");

      setTaskList((prev) => [...prev, responseData]);
    } catch (err) {
      console.log(err);

      let errorMessage = "";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      if (errorMessage === "Failed to fetch") {
        errorMessage = "Ocorreu um erro ao adicionar a tarefa.";
      }

      Alerts.showError("Opss", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) setValue("deadline", selectedDate);
  }, [selectedDate, setValue]);

  return (
    <div className="rounded-sm  bg-white dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="text-xl font-medium text-black dark:text-white">
          Adicionar Tarefa
        </h3>
      </div>
      <div className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5.5">
            <label
              className="text-md mb-3 block text-start font-medium text-black dark:text-white"
              htmlFor="name"
            >
              Nome da Tarefa
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <Tag height={20} />
              </span>
              <input
                {...register("name")}
                className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 pl-11.5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                type="text"
                name="name"
                id="name"
                placeholder="Fazer Dashboard"
              />
              {errors.name && (
                <p className="text-start text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="text-md mb-3 block text-start font-medium text-black dark:text-white"
              htmlFor="deadline"
            >
              Data Limite
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                deadlineRequired={true}
              />
              {errors.deadline && (
                <p className="text-start text-red-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="text-md mb-3 block text-start font-medium text-black dark:text-white"
              htmlFor="price"
            >
              Custo
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <DollarSign height={20} opacity={0.7} />
              </span>
              <input
                {...register("price", { valueAsNumber: true })}
                className=" w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 pl-11.5 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                type="number"
                name="price"
                id="price"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <p className="text-start text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 disabled:bg-gray-400/20 dark:border-strokedark dark:text-white"
              type="button"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              disabled={isLoading}
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:bg-primary/50"
              type="submit"
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskForm;
