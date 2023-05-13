import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useImmer } from 'use-immer';

import { useWorkspace } from '@/components/WorkspaceProvider';

import { getFetchTodosError } from '../alerts';
import { TodoType } from '../types';

export const useTodos = () => {
    const { account, contract } = useWorkspace();

    const [todos, setTodos] = useImmer<TodoType[]>([]);

    const toast = useToast();

    const fetchTodos = async () => {
        if (account && contract) {
            const todos = await contract.getTodos();

            return todos;
        }

        return [];
    };

    const { isLoading, error } = useQuery({
        queryKey: ['todos', account],
        queryFn: fetchTodos,
        onSuccess: (fetchedTodos) => {
            setTodos(fetchedTodos);
        },
        refetchOnWindowFocus: false,
        enabled: !!(account && contract),
    });

    useEffect(() => {
        if (error instanceof Error) toast(getFetchTodosError(error.message));
    }, [error]);

    return { todos, setTodos, isLoading };
};
