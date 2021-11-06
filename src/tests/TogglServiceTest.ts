import { Properties } from "../audary";
import { createTogglInstance, RequestParams } from "../lib/TogglService";

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
