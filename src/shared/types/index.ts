import { Updater } from 'use-immer';
import type { BigNumber } from 'ethers';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

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

export type StatsStateType = {
    created: BigNumber;
    completed: BigNumber;
    deleted: BigNumber;
};

export type AchievementsStateType = {
    createOneTodo: BigNumber;
    completeOneTodo: BigNumber;
    deleteOneTodo: BigNumber;
    createTenTodos: BigNumber;
    completeTenTodos: BigNumber;
    deleteTenTodos: BigNumber;
    createHundreedTodos: BigNumber;
    completeHundreedTodos: BigNumber;
    deleteHundreedTodos: BigNumber;
    createThousandTodos: BigNumber;
    completeThousandTodos: BigNumber;
    deleteThousandTodos: BigNumber;
};

export type AchievementsMetadataType = {
    title: string;
    description: string;
    achievementKey: keyof AchievementsStateType;
    statsStateKey: keyof StatsStateType;
    amount: 1 | 10 | 100 | 1000;
    image: string;
};

export type AiImageStateType = {
    isInitialized: boolean;
    tryCount: number;
};

export type AiImageGeneratorElementType = {
    balance: number;
    aiImageState: AiImageStateType;
    setBalance: Dispatch<SetStateAction<number>>;
    setAiImageState: Dispatch<SetStateAction<AiImageStateType>>;
};

export type SavedAiImageType = {
    name: string;
    description: string;
    image: string;
    nftId: number;
};

export type AchievementCardType = {
    mintId: BigNumber | null;
    stats: StatsStateType | null;
    isWaitingAchievementMint: MutableRefObject<boolean>;
} & AchievementsMetadataType;
