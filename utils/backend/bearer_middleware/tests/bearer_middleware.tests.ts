/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextFunction, Request, Response } from "express";
import type {
  createBearerMiddleware,
  GetTokenFromRequest,
} from "../bearer_middleware";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

describe("createBearerMiddleware", () => {
  let fakeGetTokenFromRequest: jest.MockedFn<GetTokenFromRequest>;
  let verify: jest.MockedFn<(token: string) => Promise<string | undefined>>;

  let req: Request;
  let res: Response;
  let next: jest.MockedFn<() => void>;

  let AuthorizationError: typeof Error;
  let createBearerMiddlewareFn: typeof createBearerMiddleware;
  let bearerMiddleware: Middleware;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    fakeGetTokenFromRequest = jest.fn();
    verify = jest.fn();

    const middlewareModule = require("../bearer_middleware");
    createBearerMiddlewareFn = middlewareModule.createBearerMiddleware;
    AuthorizationError = middlewareModule.AuthorizationError;
  });

  describe("When called", () => {
    beforeEach(() => {
      req = {
        header: (_name: string) => undefined,
      } as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      next = jest.fn();

      bearerMiddleware = createBearerMiddlewareFn(
        verify,
        fakeGetTokenFromRequest,
      );
    });

    describe("When `getTokenFromRequest` throws an exception ('Fake error')", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockRejectedValue(
          new AuthorizationError("Fake error"),
        );
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Fake error"`, async () => {
        expect.assertions(8);

        expect(fakeGetTokenFromRequest).not.toHaveBeenCalled();
        await bearerMiddleware(req, res, next);

        expect(fakeGetTokenFromRequest).toHaveBeenCalledTimes(1);
        expect(fakeGetTokenFromRequest).toHaveBeenLastCalledWith(req);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Fake error",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the middleware cannot verify the token", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("TOKEN");

        verify.mockImplementation(() => Promise.resolve(undefined));
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Token is invalid"`, async () => {
        expect.assertions(5);

        await bearerMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Token is invalid",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});

describe("getTokenFromHttpHeader", () => {
  let getHeader: jest.MockedFn<(name: string) => string | undefined>;
  let req: Request;
  let getTokenFromHttpHeader: (req: Request) => string;
  let AuthorizationError: typeof Error;

  beforeEach(() => {
    getHeader = jest.fn();
    req = {
      header: (name: string) => getHeader(name),
    } as Request;

    const bearerMiddlewareModule = require("../bearer_middleware");
    getTokenFromHttpHeader = bearerMiddlewareModule.getTokenFromHttpHeader;
    AuthorizationError = bearerMiddlewareModule.AuthorizationError;
  });

  describe("When the 'Authorization' header is missing", () => {
    beforeEach(() => {
      getHeader.mockReturnValue(undefined);
    });

    it(`Throws a AuthorizationError with message = 'Missing the "Authorization" header'`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new AuthorizationError('Missing the "Authorization" header'),
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' header doesn't have a Bearer scheme", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Beerer FAKE_TOKEN");
    });

    it(`Throws a AuthorizationError with message = 'Missing a "Bearer" token in the "Authorization" header''`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new AuthorizationError(
          'Missing a "Bearer" token in the "Authorization" header',
        ),
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' Bearer scheme header doesn't have a token", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Bearer ");
    });

    it(`Throws a AuthorizationError with message = 'Missing a "Bearer" token in the "Authorization" header'`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new AuthorizationError(
          'Missing a "Bearer" token in the "Authorization" header',
        ),
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' Bearer scheme header has a token", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Bearer TOKEN");
    });

    it(`Returns the token`, async () => {
      expect.assertions(3);

      expect(getTokenFromHttpHeader(req)).toEqual("TOKEN");
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });
});
