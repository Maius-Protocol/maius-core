export type MaiusPayment = {
  "version": "0.1.0",
  "name": "maius_payment",
  "instructions": [
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
          "isMut": false,
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
        },
        {
          "name": "expirationPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializeCustomerServiceAccount",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "customerServicesAccount",
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
      "name": "initializeInvoice",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerServicesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerAuthority",
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
      "accounts": [
        {
          "name": "walletA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
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
          },
          {
            "name": "expirationPeriod",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "serviceInvoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "serviceAccount",
            "type": "publicKey"
          },
          {
            "name": "invoiceAccounts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "customerServices",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "invoiceCount",
            "type": "u8"
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
          },
          {
            "name": "expirationTimestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "expiration_time_exceed",
      "msg": "expiration_time_exceed"
    }
  ]
};

export const IDL: MaiusPayment = {
  "version": "0.1.0",
  "name": "maius_payment",
  "instructions": [
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
          "isMut": false,
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
        },
        {
          "name": "expirationPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializeCustomerServiceAccount",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "customerServicesAccount",
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
      "name": "initializeInvoice",
      "accounts": [
        {
          "name": "serviceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerServicesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "customerAuthority",
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
      "accounts": [
        {
          "name": "walletA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
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
          },
          {
            "name": "expirationPeriod",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "serviceInvoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "serviceAccount",
            "type": "publicKey"
          },
          {
            "name": "invoiceAccounts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "customerServices",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "invoiceCount",
            "type": "u8"
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
          },
          {
            "name": "expirationTimestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "expiration_time_exceed",
      "msg": "expiration_time_exceed"
    }
  ]
};
