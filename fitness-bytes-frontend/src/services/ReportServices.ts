import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface Report {
    _id: string;
    ownerUsername: string;
    userId: string;
    postId: string;
}

type ReportPostResponse = Report;

type ReportResponse = ResponseResult<ReportPostResponse>;

class ReportServices {
    private static fact = new EndpointFactory<ReportResponse>("/report");

    static post = ReportServices.fact.post<ReportPostResponse, Report>();
}

export default ReportServices;