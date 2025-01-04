const { test: jestTest, expect: jestExpect } = require('@jest/globals');
import { jsonToEnv } from "../index";

// setup clean function to remove the .env file if it exists before each test
beforeEach(() => {
  const fs = require("fs");
  const path = require("path");
  const envFilePath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envFilePath)) {
    fs.unlinkSync(envFilePath);
  }
});

let config = {
  database: {
    host: "localhost",
    port: 5432,
  },
}

describe("jsonToEnv", () => {
  it("should correctly convert a JSON object to environment variables", () => {

    const result = jsonToEnv(config);

    expect(process.env.DATABASE_HOST).toBe("localhost");
    expect(process.env.DATABASE_PORT).toBe("5432");
    expect(result).toStrictEqual({
      DATABASE_HOST: "localhost",
      DATABASE_PORT: "5432",
    });
  });

  it("should apply a prefix to the environment variables if specified", () => {

    const result = jsonToEnv(config, { prefix: "APP_" });

    expect(process.env.APP_DATABASE_HOST).toBe("localhost");
    expect(result).toStrictEqual({
      APP_DATABASE_HOST: "localhost",
      APP_DATABASE_PORT: "5432",
    });
  });

  it("should correctly handle nested objects", () => {
    const nestedConfig = {
      database: {
        host: "localhost",
        port: 5432,
        credentials: {
          username: "admin",
          password: "password",
        },
      },
    };

    const result = jsonToEnv(nestedConfig);

    expect(process.env.DATABASE_HOST).toBe("localhost");
    expect(process.env.DATABASE_PORT).toBe("5432");
    expect(process.env.DATABASE_CREDENTIALS_USERNAME).toBe("admin");
    expect(process.env.DATABASE_CREDENTIALS_PASSWORD).toBe("password");
    expect(result).toStrictEqual({
      DATABASE_HOST: "localhost",
      DATABASE_PORT: "5432",
      DATABASE_CREDENTIALS_USERNAME: "admin",
      DATABASE_CREDENTIALS_PASSWORD: "password",
    });
  });

  it("should correctly handle arrays", () => {
    const arrayConfig = {
      database: {
        hosts: ["localhost", "http://localhost"],
      },
    };

    const result = jsonToEnv(arrayConfig);

    expect(process.env.DATABASE_HOSTS).toBe("localhost,http://localhost");
    expect(result).toStrictEqual({
      DATABASE_HOSTS: "localhost,http://localhost",
    });
  });

  it("should not create an .env file by default", () => {

    const result = jsonToEnv(config);

    // check if the .env file was created
    const fs = require("fs");
    const path = require("path");
    const envFilePath = path.resolve(process.cwd(), ".env");
    expect(fs.existsSync(envFilePath)).toBe(false);
  });

  it("should create a .env file if enfFile option is true", () => {

    const result = jsonToEnv(config, { envFile: true });

    const fs = require("fs");
    const path = require("path");
    const envFilePath = path.resolve(process.cwd(), ".env");
    expect(fs.existsSync(envFilePath)).toBe(true);
  });

  it("should create a .env file with the environment variables with valid contents", () => {

    const result = jsonToEnv(config, { envFile: true });

    // check if the .env file was created
    const fs = require("fs");
    const path = require("path");
    const envFilePath = path.resolve(process.cwd(), ".env");
    expect(fs.existsSync(envFilePath)).toBe(true);

    // check the contents of the .env file
    const envFileContents = fs.readFileSync(envFilePath, "utf8");
    console.log(`.env file contents:\n${envFileContents}`);
    expect(envFileContents).toBe("DATABASE_HOST=localhost\nDATABASE_PORT=5432");
  });

  it("should create a .env file with the specified name and path", () => {

    const result = jsonToEnv(config, { envFile: true, envFileName: ".env.local", envFilePath: "./src" });

    const fs = require("fs");
    const path = require("path");
    const envFilePath = path.resolve(process.cwd(), "src/.env.local");
    expect(fs.existsSync(envFilePath)).toBe(true);
  });
});