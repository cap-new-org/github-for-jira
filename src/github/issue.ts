import { emitWebhookProcessedMetrics } from "utils/webhook-utils";
import { CustomContext } from "middleware/github-webhook-middleware";
import { GitHubInstallationClient } from "./client/github-installation-client";
import { getCloudInstallationId } from "./client/installation-id";
import { WebhookPayloadIssues } from "@octokit/webhooks";

export const issueWebhookHandler = async (context: CustomContext<WebhookPayloadIssues>, _jiraClient, util, githubInstallationId: number): Promise<void> => {
	const { issue, repository } = context.payload;

	const githubClient = new GitHubInstallationClient(getCloudInstallationId(githubInstallationId), jiraHost, context.log);

	// TODO: need to create reusable function for unfurling
	let linkifiedBody;
	try {
		linkifiedBody = await util.unfurl(issue.body);
		if (!linkifiedBody) {
			context.log("Halting further execution for issue since linkifiedBody is empty");
			return;
		}
	} catch (err) {
		context.log.warn(
			{ err, linkifiedBody, body: issue.body },
			"Error while trying to find jira keys in issue body"
		);
	}

	context.log(`Updating issue in GitHub with issueId: ${issue.id}`);

	const githubResponse = await githubClient.updateIssue({
		body: linkifiedBody,
		owner: repository.owner.login,
		repo: repository.name,
		issue_number: issue.number
	});
	const { webhookReceived, name, log } = context;

	webhookReceived && emitWebhookProcessedMetrics(
		webhookReceived,
		name,
		log,
		githubResponse?.status
	);
};
