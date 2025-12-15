const  ERC721_ABI = [
  // ===== 基础查询 =====
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "name": "balance", "type": "uint256" }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "ownerOf",
    "outputs": [
      { "name": "owner", "type": "address" }
    ],
    "type": "function"
  },

  // ===== 元数据扩展 =====
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      { "name": "", "type": "string" }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      { "name": "", "type": "string" }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "tokenURI",
    "outputs": [
      { "name": "", "type": "string" }
    ],
    "type": "function"
  },

  // ===== 可枚举扩展 =====
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "index", "type": "uint256" }
    ],
    "name": "tokenByIndex",
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "index", "type": "uint256" }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "type": "function"
  },

  // ===== 转移与授权 =====
  {
    "constant": false,
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" },
      { "name": "data", "type": "bytes" }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "approved", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "getApproved",
    "outputs": [
      { "name": "", "type": "address" }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "approved", "type": "bool" }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "operator", "type": "address" }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      { "name": "", "type": "bool" }
    ],
    "type": "function"
  },

  // ===== 事件 =====
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "name": "from",     "type": "address" },
      { "indexed": true,  "name": "to",       "type": "address" },
      { "indexed": true,  "name": "tokenId",  "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "name": "owner",    "type": "address" },
      { "indexed": true,  "name": "approved", "type": "address" },
      { "indexed": true,  "name": "tokenId",  "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "name": "owner",    "type": "address" },
      { "indexed": true,  "name": "operator", "type": "address" },
      { "indexed": false, "name": "approved", "type": "bool" }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  }
];
export default ERC721_ABI
