import { Request, Response, NextFunction } from "express";
declare function list(req: Request, res: Response, _next: NextFunction): Promise<void>;
declare const _default: {
    list: typeof list;
};
export default _default;
