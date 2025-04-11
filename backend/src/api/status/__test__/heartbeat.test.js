import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import supertest from "supertest";

const app = getServer();

describe("Heart Beat API", () => {
  describe("get heartbeat", () => {
    describe("given router should work", () => {
      it("Should return 200 status and API is running healthy message", async () => {
        const { body, statusCode } = await supertest(app).get(`${API_PATH}heartbeat`);
        expect(body.data).toBe("API is running healthy");
        expect(statusCode).toBe(200);
        expect(body.message).toBe("Success");
      });

      it("Should return 200 status and API is running healthy message", async () => {
        const { statusCode } = await supertest(app).get(`${API_PATH}docs`);
        expect(statusCode).toBe(301);
      });
    });
  });
});
