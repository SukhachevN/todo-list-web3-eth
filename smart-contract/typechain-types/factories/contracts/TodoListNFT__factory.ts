/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TodoListNFT,
  TodoListNFTInterface,
} from "../../contracts/TodoListNFT";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "todoNFTAddress",
        type: "address",
      },
    ],
    name: "setTodoNFTContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b61029d8061007e6000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063232877bf14610051578063715018a6146100665780638da5cb5b1461006e578063f2fde38b1461008d575b600080fd5b61006461005f366004610237565b6100a0565b005b6100646100d7565b600054604080516001600160a01b039092168252519081900360200190f35b61006461009b366004610237565b6100eb565b6100a8610180565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6100df610180565b6100e960006101da565b565b6100f3610180565b6001600160a01b0381166101745760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b61017d816101da565b50565b6000546001600160a01b031633146100e95760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161016b565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561024957600080fd5b81356001600160a01b038116811461026057600080fd5b939250505056fea2646970667358221220eeebdbcc4d1ab03f6b3f4e71d528d1dfe8dc676f0f222bd9d52695aff161616264736f6c63430008120033";

type TodoListNFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TodoListNFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TodoListNFT__factory extends ContractFactory {
  constructor(...args: TodoListNFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TodoListNFT> {
    return super.deploy(overrides || {}) as Promise<TodoListNFT>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TodoListNFT {
    return super.attach(address) as TodoListNFT;
  }
  override connect(signer: Signer): TodoListNFT__factory {
    return super.connect(signer) as TodoListNFT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TodoListNFTInterface {
    return new utils.Interface(_abi) as TodoListNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TodoListNFT {
    return new Contract(address, _abi, signerOrProvider) as TodoListNFT;
  }
}
