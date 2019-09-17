const {
	SharedKeyCredential,
	QueueServiceClient
} = require("@azure/storage-queue");
const config = require("../config");
const accountName = config.queueCreds.accountName;
const accountKey = config.queueCreds.accountKey;
const sharedKeyCredential = new SharedKeyCredential(accountName, accountKey);
const queueServiceClient = new QueueServiceClient(
	`https://${accountName}.queue.core.windows.net`,
	sharedKeyCredential
);

const getQueueContainers = async () => {
	try {
		let queuesList = queueServiceClient.listQueues();
		let queueArray = [];
		for await (const item of queuesList) {
			queueArray.push(item.name);
		}
		return queueArray;
	} catch (error) {
		console.log(error);
	}
	return false;
}

const sendMessage = async (queue, message) => {
	try {
		const queueClient = queueServiceClient.getQueueClient(queue);
		const existingQueues = await getQueueContainers();
		if (!existingQueues || !existingQueues.includes(queue)) {
			const createQueueResponse = await queueClient.create();
			console.log(createQueueResponse);
		}
		const messagesClient = queueClient.getMessagesClient();
		const enqueueQueueResponse = await messagesClient.enqueue(message);
		console.log(`Message successfully sent. 
		Message ID: ${enqueueQueueResponse.messageId}
		Request ID: ${enqueueQueueResponse.requestId}`
		);
		return true;
	} catch (error) {
		console.log(error);
	}
	return false;
}
module.exports = {
	getQueueContainers,
	sendMessage
}
