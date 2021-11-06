export type Properties = {
    SLACK_BOT_TOKEN: string;
    TOGGL_API_TOKEN: string;
    TOGGL_USER_AGENT: string;
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
        "event": JSON.stringify(event),
        "parameter": JSON.stringify(parameter)
    });
};
