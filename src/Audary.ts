import { createTogglInstance, ITogglService, RequestParams, SummaryReport } from "./lib/TogglService";

export type Properties = {
    SLACK_BOT_TOKEN: string;
    SLACK_MESSAGE_TEMPLATE: string;
    TOGGL_API_TOKEN: string;
    TOGGL_USER_AGENT: string;
    TOGGL_WORKSPACE_ID: string;
};

export type SlackEventParameters = {
    team_id: string;
    text: string;
    command: "/audary";
    is_enterprise_install: boolean;
    team_domain: string;
    api_app_id: string;
    channel_name: string;
    user_name: string;
    user_id: string;
    channel_id: string;
    response_url: string;
    trigger_id: string;
    token: string;
};

const doPost = (event: GoogleAppsScript.Events.DoPost) => {
    if (!event) return;

    const parameter = event.parameter as unknown as SlackEventParameters;

    const scriptProperty = PropertiesService.getScriptProperties();
    const properties = scriptProperty.getProperties() as unknown as Properties;

    scriptProperty.setProperties({
        "event": JSON.stringify(event)
    });

    const toggl: ITogglService = createTogglInstance(properties.TOGGL_API_TOKEN);
    const today = new Date().toISOString().substr(0, 10);

    const params: RequestParams = {
        user_agent: properties.TOGGL_USER_AGENT,
        workspace_id: Number(properties.TOGGL_WORKSPACE_ID),
        since: today
    };

    const reportResponse = toggl.getSummaryReport(params);
    if (!reportResponse.ok) {
        return ask(reportResponse);
    }

    const message = createSlackMessage(
        reportResponse.report.data as SummaryReport[],
        today,
        properties
    );



};

const ask = (message: object) => {
    return ContentService
        .createTextOutput(JSON.stringify(message))
        .setMimeType(ContentService.MimeType.JSON);
};

const convertMillisecondIntoMinutes = (milliseconds: number): number => {
    return milliseconds / 1000 / 60;
}

const createSlackMessage = (
    summaryReport: SummaryReport[],
    dateString: string,
    properties: Properties
): string => {
    const timeEntryList = summaryReport.flatMap(report => {
        return report.items.map(item => {
            return "・" + item.title.time_entry
                + ": "
                + Math.round(convertMillisecondIntoMinutes(item.time) * 100) / 100
                + " 分";
        });
    }).join("\n");

    const template = properties.SLACK_MESSAGE_TEMPLATE;

    return template
        .replace(/{{ today }}/, dateString)
        .replace(/{{ timeEntryList }}/, timeEntryList);
};

export { createSlackMessage };
