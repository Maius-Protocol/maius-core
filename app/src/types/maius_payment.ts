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
    }
  ]
};
