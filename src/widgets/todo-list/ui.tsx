import { Button, Flex, HStack, VStack, Text } from '@chakra-ui/react';

import { emptyTodoArray } from '@/shared/constants';
import { TodoModal } from '@/shared/ui';
import TodoCard from '@/entities/todo';

import { useTodoList } from './model';

const Main = () => {
    const {
        handleCreateTodo,
        isWaitingNewTodo,
        currentTodo,
        isOpen,
        onClose,
        todos,
        setTodos,
        isLoading,
    } = useTodoList();

    return (
        <VStack spacing={10} h="100%">
            <HStack alignItems="flex-start" p="20px">
                <Button
                    onClick={handleCreateTodo}
                    isLoading={isWaitingNewTodo.current}
                >
                    Create todo
                </Button>
                <TodoModal
                    index={currentTodo.index}
                    isOpen={isOpen}
                    onClose={onClose}
                    todo={currentTodo.todo}
                    setTodos={setTodos}
                    isWaitingNewTodo={isWaitingNewTodo}
                />
            </HStack>
            <Flex
                wrap="wrap"
                w="100%"
                h="100%"
                gap="20px"
                justifyContent="center"
                overflow="auto"
                pb="20px"
            >
                {isLoading
                    ? emptyTodoArray.map((_, index) => (
                          <TodoCard
                              key={index}
                              index={index}
                              todo={null}
                              setTodos={setTodos}
                          />
                      ))
                    : todos.map((todo, index) => (
                          <TodoCard
                              index={index}
                              key={todo?.id?.toNumber() ?? index}
                              todo={todo}
                              setTodos={setTodos}
                          />
                      ))}
                {!isLoading && !todos.length && (
                    <Text variant="gradient-main" textAlign="center">
                        Here you will see your todos
                    </Text>
                )}
            </Flex>
        </VStack>
    );
};

export default Main;
