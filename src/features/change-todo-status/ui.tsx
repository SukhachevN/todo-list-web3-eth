import { Switch } from '@chakra-ui/react';
import { FC } from 'react';

import { TodoStatusSwitchType, useTodoStatusSwitch } from './model';

const TodoStatusSwitch: FC<TodoStatusSwitchType> = ({
    todo,
    ...otherProps
}) => {
    const onChange = useTodoStatusSwitch({ todo, ...otherProps });

    return (
        <Switch
            name="isCompleted"
            isChecked={todo?.isCompleted}
            onChange={onChange}
        />
    );
};

export default TodoStatusSwitch;
