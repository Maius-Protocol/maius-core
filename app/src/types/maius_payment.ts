export type MaiusPayment = {
  "version": "0.1.0",
  "name": "maius_payment",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initializeMerchant",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateMerchant",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "logo",
          "type": "string"
        }
      ]
    },
    {
      "name": "createService",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "expectedAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeInvoice",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "tranferAToB",
      "accounts": [],
      "args": []
    },
    {
      "name": "transferBToWallet",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletB",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "merchant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "serviceCount",
            "type": "u8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "logo",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "service",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "expectedAmount",
            "type": "u64"
          },
          {
            "name": "subscriptionAccounts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "invoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userWallet",
            "type": "publicKey"
          },
          {
            "name": "isPaid",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "amountExceed",
      "msg": "This is an error message clients will automatically display"
    }
  ]
};

export const IDL: MaiusPayment = {
  "version": "0.1.0",
  "name": "maius_payment",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initializeMerchant",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateMerchant",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "logo",
          "type": "string"
        }
      ]
    },
    {
      "name": "createService",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "expectedAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeInvoice",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "tranferAToB",
      "accounts": [],
      "args": []
    },
    {
      "name": "transferBToWallet",
      "accounts": [
        {
          "name": "merchantAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletB",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "merchant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "serviceCount",
            "type": "u8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "logo",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "service",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "expectedAmount",
            "type": "u64"
          },
          {
            "name": "subscriptionAccounts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "invoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userWallet",
            "type": "publicKey"
          },
          {
            "name": "isPaid",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "amountExceed",
      "msg": "This is an error message clients will automatically display"
    }
  ]
};
