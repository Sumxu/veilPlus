import { useCallback } from "react";
import { ethers } from "ethers";
import EnvManager from "@/config/EnvManager";

interface NFTCall {
  contractAddress: string;
  abi: any;          // 👈 新增：每个合约可以传不同 ABI
  params?: any[];
}

/**
 * 支持动态 ABI 的 NFT multicall
 */
export const useNFTMulticall = () => {
  const fetch = useCallback(
    async (methodName: string, calls: NFTCall[]) => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const multicallContract = new ethers.Contract(
          EnvManager.multiCallToken,
          [
            "function aggregate(tuple(address target, bytes callData)[] calls) public view returns (uint256 blockNumber, bytes[] returnData)",
          ],
          provider
        );

        // 构造 callData（使用动态 ABI）
        const callDataArray = calls.map(({ contractAddress, abi, params = [] }) => {
          const contract = new ethers.Contract(contractAddress, abi, provider);
          const callData = contract.interface.encodeFunctionData(methodName, params);

          return { target: contractAddress, callData };
        });

        const { returnData } = await multicallContract.aggregate(callDataArray);

        // 解码每个返回值（使用动态 ABI）
        const results = returnData.map((data, i) => {
          const { contractAddress, abi } = calls[i];
          const contract = new ethers.Contract(contractAddress, abi, provider);
          const decoded = contract.interface.decodeFunctionResult(methodName, data);
          return decoded.length === 1 ? decoded[0] : decoded;
        });

        return { success: true, data: results };
      } catch (err: any) {
        console.error(err);
        return { success: false, error: err.message || "Multicall failed" };
      }
    },
    []
  );

  return { fetch };
};
