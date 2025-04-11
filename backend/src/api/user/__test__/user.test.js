import { beforeAll, afterAll, describe, it, expect } from "node:test";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import { getClientAndDB } from "@/lib/test-setup/test-db";
import { clearAllUsers, genFakeUsers, insertAllUsers } from "@/mock/users";
import supertest from "supertest";

jest.setTimeout(150000);

const MOCK_USERS = genFakeUsers();

let app = null;
let container = null;
let db = null;
let userList = [];
const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxOjhlOmI3OjA1OjYwOjcyOmE4OjM3OmMyOjkxOmY1OjdlOjVlOjk5OmNkOjExIiwidHlwIjoiSldUIn0.eyJhdWQiOltdLCJhenAiOiIzYzhjYTY1NjNkZDI0YjJjYTc2ZjAyYjVlYjIyZTZjNCIsImV4cCI6MTczMDUyMzA5NywiZ3R5IjpbImNsaWVudF9jcmVkZW50aWFscyJdLCJpYXQiOjE3MzA0MzY2OTcsImlzcyI6Imh0dHBzOi8vbWFyY2NvcnAua2luZGUuY29tIiwianRpIjoiMzg4MThiYWYtNzljMy00MTBjLWE2M2ItMzA1YWZkYzE0NmNkIiwic2NvcGUiOiIiLCJzY3AiOltdLCJ2IjoiMiJ9.oNlt4kvZUKkxeXxSfDh7n40GWGTlHM2fBMwasuujzPgSl4NusRX30ar7NOH-ILR2BDTlU3O9T-dux3YCELoCnaX3542_dm7UQW37if6YBtSF8QlgSjDWsfbfOP33JABpm_WuwXhnE9B-seAJMeWyBKpuLhPLM3KFdAl9TDp9Z8IXrDgkE-H25DNjQgotYK8-nJWiZsBYvkcCY7IniCzCBhKMVcfY8GlCBmpydMIuRgzpIbzW24NQ6QlTlwbpMBKRRjnf01gAOGyGkmlJq_muPTtaouhPq91-SCMzENWy4y7C4kvEFZar0nKyuX8GYbH3ophK1inUMeuyztMCC0ph1w";

beforeAll(async () => {
  const resp = await getClientAndDB("user-mongo-test");

  db = resp.client;
  container = resp.container;

  await clearAllUsers();

  userList = await insertAllUsers(MOCK_USERS)();

  app = getServer();
}, 5000);

afterAll(async () => {
  await clearAllUsers();
  await container?.stop();
});

describe("User API", () => {
  it("App should work", () => {
    expect(app).not.toBeNull();
    expect(db).not.toBeNull();
  });

  describe("GET user", () => {
    it("👍 Should return 200 status and should return user list", async () => {
      const { statusCode } = await supertest(app)
        .get(`${API_PATH}user`)
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(200);
    });

    it("👍 Should return 200 status and should return a user", async () => {
      const { statusCode } = await supertest(app)
        .get(`${API_PATH}user/${userList[0].id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(200);
    });

    it("🤷 Should return 500 status and should not return user", async () => {
      const { body, statusCode } = await supertest(app)
        .get(`${API_PATH}user/2584`)
        .set("Authorization", `Bearer ${token}`);
      expect(body.message).toEqual("Request params Validation Error");
      expect(statusCode).toBe(404);
    });
  });

  describe("POST user", () => {
    const user = { email: "user5@example.com", password: "Element@#1", name: "John Doe5" };
    const nextUser = { email: "user6@example.com", password: "Element@#1", name: "John Doe6" };
    const userInvalid = { email: "user6@:example.com", password: "Element@#1", name: "John Doe6" };
    const userPasswordInvalid = { email: "user7@example.com", password: "element@#1", name: "John Doe7" };
    const userInvalid2 = { email: "user6@:example.com", password: "Element@#1" };

    it("👍 Should return added user and should return status 201", async () => {
      const { body, statusCode } = await supertest(app)
        .post(`${API_PATH}user/`)
        .send(user)
        .set("Authorization", `Bearer ${token}`);
      expect(body.data.name).toBe(user.name);
      expect(statusCode).toBe(201);
    });

    it("👎 Should return 400 for invalid email", async () => {
      const { body, statusCode } = await supertest(app)
        .post(`${API_PATH}user`)
        .send(userInvalid)
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(400);
      expect(body.data[0].code).toBe("invalid_string");
    });

    it("👎 Should return 400 for password complexity ", async () => {
      const { body, statusCode } = await supertest(app)
        .post(`${API_PATH}user`)
        .send(userPasswordInvalid)
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(400);
      expect(body.data[0].message).toBe("password does not meet complexity requirements");
    });
  });

  describe("PUT user", () => {
    let user = null;

    beforeAll(async () => {
      userList = await insertAllUsers(MOCK_USERS)();
      user = userList[0];
    });

    it("👍 Should return 201 status and should update the user", async () => {
      const { body, statusCode } = await supertest(app)
        .put(`${API_PATH}user/${user.id}`)
        .send({ name: "Jane Doe" })
        .set("Authorization", `Bearer ${token}`);
      expect(body.data._id).toEqual(user.id);
      expect(body.data.name).toEqual(user.name);
      expect(statusCode).toBe(201);
    });
  });

  describe("DELETE user", () => {
    it("👍 Should delete user and return 200", async () => {
      const { body, statusCode } = await supertest(app)
        .delete(`${API_PATH}user/${userList[0].id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(body.message).toBe("User Deleted");
      expect(statusCode).toBe(200);
    });
  });
});
