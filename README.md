# json-to-env-converter

A utility to convert JSON objects into environment variables.

This tool will flatten the JSON object and convert it into uppercase environment variables, setting the values in the `process.env` object and optionally creating a `.env` file.

---

## **Installation**

Install the package via npm:

```bash
npm install json-to-env-converter
```

---

## **Usage**

### **Basic Example**
```typescript
import { jsonToEnv } from 'json-to-env-converter';

const config = {
  database: {
    host: 'localhost',
    port: 5432,
  },
};

// Convert JSON to environment variables
const result = jsonToEnv(config);

console.log(process.env.DATABASE_HOST); // Output: 'localhost'
console.log(process.env.DATABASE_PORT); // Output: '5432'
console.log(result); // Output: { DATABASE_HOST: 'localhost', DATABASE_PORT: '5432' }
```

---

### **Using a Prefix**
You can add a custom prefix to the environment variable names:

```typescript
import { jsonToEnv } from 'json-to-env-converter';

const config = {
  api: {
    key: 'my-api-key',
    secret: 'my-secret-key',
  },
};

const result = jsonToEnv(config, { prefix: 'APP_' });

console.log(process.env.APP_API_KEY);    // Output: 'my-api-key'
console.log(process.env.APP_API_SECRET); // Output: 'my-secret-key'
console.log(result); // Output: { APP_API_KEY: 'my-api-key', APP_API_SECRET: 'my-secret-key' }
```

---

### **Nested Objects**
The package automatically flattens nested objects into uppercase environment variables:

```typescript
import { jsonToEnv } from 'json-to-env-converter';

const config = {
  app: {
    database: {
      host: 'db-host',
      port: 3306,
    },
    api: {
      key: "my-api-key",
      secret: "my-secret-key"
    }
  },
};

jsonToEnv(config);

console.log(process.env.APP_DATABASE_HOST); // Output: 'db-host'
console.log(process.env.APP_DATABASE_PORT); // Output: '3306'
console.log(process.env.APP_API_KEY); // Output: 'my-api-key'
console.log(process.env.APP_API_SECRET); // Output: 'my-secret-key'
```

---

### **Available Options**
The `jsonToEnv` function accepts an optional options object with the following properties:

- `prefix`: A string to add a prefix to the environment variable names (default: `''`).
- `envFile`: A boolean to enable or disable the creation of the `.env` file (default: `false`); if enabled and the file already exists, it will be overwritten.
- `envFileName`: A string to specify the name of the `.env` file (default: `.env`).
- `envFilePath`: A string to specify the path where the `.env` file should be created (default: `.`).

```typescript
import { jsonToEnv } from 'json-to-env-converter';

const config = {
  database: {
    host: 'localhost',
    port: 5432,
  },
  api: {
    key: 'my-api-key',
    retries: 3,
  },
  enableFeatureX: true,
};

// Convert JSON to environment variables and create a .env file
jsonToEnv(config, { prefix: 'APP_', envFile: true, envFileName: '.env.local', envFilePath: './src' });

console.log(process.env.APP_DATABASE_HOST); // "localhost"
console.log(process.env.APP_DATABASE_PORT); // "5432"
console.log(process.env.APP_API_KEY); // "my-api-key"
console.log(process.env.APP_ENABLEFEATUREX); // "true"
```

---

### **Error Handling**
If the input JSON is invalid, the function throws an error:

```typescript
import { jsonToEnv } from 'json-to-env-converter';

try {
  jsonToEnv([]);
} catch (error) {
  console.error(error.message); // Output: 'Invalid input: Only JSON objects are supported.'
}
```

---

## **License**

This project is licensed under the [MIT License](./LICENSE).

