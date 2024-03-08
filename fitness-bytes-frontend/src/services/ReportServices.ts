import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface IReport {
    _id: string;
    ownerUsername: string;
    userId: string;
    postId: string;
}

type ReportResponse = ResponseResult<IReport>;

class ReportServices {
    private static fact = new EndpointFactory<ReportResponse>("/report");

    static create = ReportServices.fact.post<IReport, IReport>();
}

export type { IReport };
export default ReportServices;