import { createSlackMessage, Properties } from "../audary";
import { createTogglInstance, RequestParams, SummaryReport } from "../lib/TogglService";

const getDetailedReportTest = () => {
    const properties = PropertiesService.getScriptProperties()
        .getProperties() as unknown as Properties;

    const toggl = createTogglInstance(properties.TOGGL_API_TOKEN);

    const params: RequestParams = {
        user_agent: properties.TOGGL_USER_AGENT,
        workspace_id: Number(properties.TOGGL_WORKSPACE_ID)
    }
    const report = toggl.getDetailedReport(params);
    Logger.log(report);
};

const getSummaryReportTest = () => {
    const properties = PropertiesService.getScriptProperties()
        .getProperties() as unknown as Properties;

    const toggl = createTogglInstance(properties.TOGGL_API_TOKEN);

    const today = "2021-11-05";

    const params: RequestParams = {
        user_agent: properties.TOGGL_USER_AGENT,
        workspace_id: Number(properties.TOGGL_WORKSPACE_ID),
        since: today
    };
    const report = toggl.getSummaryReport(params);
    if (report.error) return;
    const message = createSlackMessage(
        report.report.data as SummaryReport[],
        today,
        properties);
    Logger.log(message);

}
