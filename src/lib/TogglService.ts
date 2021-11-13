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

type TotalCurrencies = {
    currency: string | null;
    amount: number | null
}

export type SummaryReportItem = {
    title: {
        time_entry: string;
    };
    time: number;
    cur: null;
    sum: null;
    rate: null;
    local_start: string;
};

export type SummaryReport = {
    id: number;
    title: {
        project: string;
        client: string;
        color: string;
        hex_color: string;
    },
    time: number;
    total_currencies: TotalCurrencies[],
    items: SummaryReportItem[];
};

export type DetailReport = {
    id: number;
    pid: number;
    tid: null;
    uid: number;
    description: string;
    start: string;
    end: string;
    updated: string;
    dur: number
    user: string;
    use_stop: boolean;
    client: string;
    project: string;
    project_color: string;
    project_hex_color: string;
    task: null,
    billable: null
    is_billable: boolean;
    cur: null;
    tags: string[];
};

export type ReportResponse = {
    total_grand: number| null;
    total_billable: number | null;
    total_currencies: TotalCurrencies[];
    data: DetailReport[] | SummaryReport[];
    total_count?: number;
    per_page?: number;
};

export type Response = {
    ok: boolean;
    report?: ReportResponse;
    error?: string;
};


export interface ITogglService {
    getDetailedReport: (params: RequestParams) => Response;
    getSummaryReport: (params: RequestParams) => Response;
}

const createTogglInstance = (token: string): ITogglService => {
    return new TogglService_(token);
};

class TogglService_ implements ITogglService {
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
    ): Response => {
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
                report: JSON.parse(resBody)
            };
        }

        return {
            ok: false,
            error: Utilities.formatString("Request faild. Response Code %d: %s", responseCode, resBody)
        }
    }

    getDetailedReport = (params: RequestParams): Response => {
        const requestParams = this.createRequestParams_(params);
        const endPoint = this.reportsAPIBaseURL
            + "/details?"
            + requestParams;

        return this.sendRequest_("get", endPoint);
    };

    getSummaryReport = (params: RequestParams): Response => {
        const requestParams = this.createRequestParams_(params);
        const endPoint = this.reportsAPIBaseURL
            + "/summary?"
            + requestParams;

        return this.sendRequest_("get", endPoint);
    }
}

export { createTogglInstance };
