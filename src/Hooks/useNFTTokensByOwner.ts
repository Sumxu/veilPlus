import { useCallback } from "react";
import { ethers } from "ethers";
import EnvManager from "@/config/EnvManager";

interface NFTCall {
  contractAddress: string;
  abi: any[];
  params?: any[];
}

export const useNFTMulticall = () => {
  const fetch = useCallback(
    async (methodName: string, calls: NFTCall[]) => {
      try {
        if (!window.ethereum) {
          throw new Error("No wallet");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const multicall = new ethers.Contract(
          EnvManager.multiCallToken,
          [
            "function aggregate(tuple(address target, bytes callData)[] calls) public view returns (uint256 blockNumber, bytes[] returnData)",
          ],
          provider
        );

        // 1️⃣ 只用 Interface，不用 new Contract(abi)
        const callDataArray = calls.map(({ contractAddress, abi, params = [] }) => {
          const iface = new ethers.utils.Interface(abi);
          const callData = iface.encodeFunctionData(methodName, params);
          return { target: contractAddress, callData };
        });

        const res = await multicall.aggregate(callDataArray);
        const returnData: string[] = res[1];

        // 2️⃣ 解码也用 Interface
        const results = returnData.map((data, i) => {
          const iface = new ethers.utils.Interface(calls[i].abi);
          const decoded = iface.decodeFunctionResult(methodName, data);
          return decoded.length === 1 ? decoded[0] : decoded;
        });

        return { success: true, data: results };
      } catch (err: any) {
        console.error("Multicall error:", err);
        return { success: false, error: err?.message || err };
      }
    },
    []
  );

  return { fetch };
};
