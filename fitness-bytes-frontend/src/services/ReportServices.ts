import ClientService, { ResponseResult } from "./ClientService";

interface Report {
    _id: string;
    ownerUsername: string;
    userId: string;
    postId: string;
}

type ReportPostResponse = Report;

type ReportResponse = ResponseResult<ReportPostResponse>;

class ReportServices {
    private client: ClientService<ReportResponse> | undefined;
    private res: ResponseResult<ReportResponse> | undefined;
    private endpoint = "/report";

    async post(report: Partial<Report>) {
        this.client = new ClientService(this.endpoint);

        if (!report.ownerUsername || !report.postId) {
            return undefined;
        }

        try {
            this.res = await this.client.post({
                ownerUsername: report.ownerUsername,
                postId: report.postId,
            });
        } catch {
            return undefined;
        }

        return this.client.checkResponse(this.res) as ReportPostResponse;
    }


}

export default ReportServices;