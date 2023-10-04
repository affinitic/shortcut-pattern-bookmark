export const importSchema = {
  "type": "object",
  "properties": {
    "shortcut": {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "enum": ["set","add"]
        },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "pattern": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "query": {
                "type": "boolean"
              }
            },
            "required": ["name", "pattern"]
          }
        }
      },
      "required": ["action", "items"],
      additionalProperties: false
    },
    "ports": {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "enum": ["set","add"]
        },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "ports": {
                "type": "string"
              },
              "siteRoots": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": ["ports", "siteRoots"],
            additionalProperties: false
          }
        }
      },
      "required": ["action", "items"],
      additionalProperties: false
    }
  },
  "required": [],
  additionalProperties: false
}
