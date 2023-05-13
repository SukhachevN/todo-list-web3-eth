import { ethers } from 'hardhat';

async function main() {
    const TodoList = await ethers.getContractFactory('TodoList');

    const todoList = await TodoList.deploy();

    console.log(todoList.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
