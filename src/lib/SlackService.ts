export type SlackMessagePayload = {
    channel: string;
    text: string;
    user: string;
};

export type SlackResponse = {
    ok: boolean,
    response?: any;
    error?: string;
};

export interface ISlackService {
    postEphemeral: (payload: SlackMessagePayload) => SlackResponse;
}

const createSlackInstance = (token: string): ISlackService => {
    return new SlackService_(token);
};

class SlackService_ implements ISlackService {
    private baseURL = "https://slack.com/api";
    private token: string;

    constructor (token: string) {
        this.token = token;
    }

    private sendRequest_ = (
        method: GoogleAppsScript.URL_Fetch.HttpMethod,
        endPoint:string,
        payload: SlackMessagePayload = null
    ): SlackResponse => {
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: method,
            contentType: "application/json; charset=UTF-8",
            headers: {
                Authorization: "Bearer " + this.token
            },
            muteHttpExceptions: true
        };
        if (payload) options.payload = JSON.stringify(payload);

        const res = UrlFetchApp.fetch(endPoint, options);
        const responseCode = res.getResponseCode();
        const resBody = res.getContentText();

        if (responseCode === 200) {
            return {
                ok: true,
                response: JSON.parse(resBody)
            };
        }

        return {
            ok: false,
            error: Utilities.formatString("Request faild. Code %d: %s", responseCode, resBody)
        };
    }

    postEphemeral = (payload: SlackMessagePayload): SlackResponse => {
        const endPoint = this.baseURL + "/chat.postEphemeral";

        return this.sendRequest_("post", endPoint, payload);
    }
}

export { createSlackInstance };
