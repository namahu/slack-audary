export type RequestParams = {
    user_agent: string;
    workspace_id: number;
    since?: string;
    until?: string;
    billable?: "yes" | "no" | "both";
    client_ids?: number[];
    project_ids?: number[];
    user_ids?: number[];
    members_of_group_ids?: number[];
    or_members_of_group_ids?: number[];
    tag_ids?: number[];
    task_ids?: number[];
    time_entry_ids?: number[];
    description?: string;
    without_description?: boolean;
    order_desc?: "on" | "off";
    distinct_rates?: "on" | "off";
    rounding?: "on" | "off";
    display_hours?: "decimal" | "minutes";
};

export interface ITogglService {
    getDetailedReport: (params: RequestParams) => string;
}

const createTogglInstance = (token: string) => {
    return new TogglService_(token);
};

class TogglService_ {
    private token: string;
    private reportsAPIBaseURL = "https://api.track.toggl.com/reports/api/v2";

    constructor (token: string) {
        this.token = token;
    }

    private createRequestParams_ = (params: RequestParams): string => {
        return Object.keys(params).map(key => {
            return key + "=" + encodeURIComponent(params[key]);
        })
        .join("&");
    }

    private sendRequest_ = (
        method: GoogleAppsScript.URL_Fetch.HttpMethod,
        endPoint: string,
        payload: any = null
    ) => {
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: method,
            headers: {
                Authorization: "Basic " + Utilities.base64Encode(this.token + ":api_token")
            },
            muteHttpExceptions: true
        };

        if (payload) {
            options.payload = JSON.stringify(payload);
            options.contentType = "application/json"
        }

        const res = UrlFetchApp.fetch(endPoint, options);

        const responseCode: number = res.getResponseCode();
        const resBody = res.getContentText();
        if (responseCode === 200) {
            return {
                ok: true,
                data: JSON.parse(resBody)
            };
        }

        return {
            ok: false,
            data: Utilities.formatString("Request faild. Response Code &d: $s", responseCode, resBody)
        }
    }

    getDetailedReport = (params: RequestParams) => {
        const requestParams = this.createRequestParams_(params);
        const endPoint = this.reportsAPIBaseURL
            + "details"
            + "?"
            + requestParams;

        return this.sendRequest_("get", endPoint);
    };
}

export { createTogglInstance };
