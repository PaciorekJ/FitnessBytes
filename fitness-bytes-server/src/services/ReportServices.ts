import ReportModel, { IReport } from "../models/Report";

async function report(report: Partial<IReport>) {
    const res = await ReportModel.create(report);
    return res;
}

export default report;