import {Request, Response} from "express";

export default {
  'GET /api/get-total-table-data' : (req: Request, res: Response) => {

    res.send({
      code: 200,
      status: "success",
      data: [
        {
          id: 1,
          name: "",
          age: "",
          children: []
        }
      ]
    })
  }
}
