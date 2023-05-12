import { Updater } from 'use-immer';
import type { BigNumber } from 'ethers';

export type TodoType = {
    id: BigNumber;
    title: string;
    description: string;
    deadline: number;
    createDate: number;
    completeDate: number;
    isCompleted: boolean;
};

export type CurrentTodoStateType = {
    index: number;
    todo: TodoType | null;
};

export type TodoCardType = {
    todo: TodoType | null;
    index: number;
    setTodos: Updater<TodoType[]>;
};

export type TodoInfoModalType = {
    isOpen: boolean;
    title: string;
    description: string;
    createDate: number;
    onClose: () => void;
};

export type TodoStateType = {
    title: string;
    description: string;
    isCompleted: boolean;
    deadline: string;
};
