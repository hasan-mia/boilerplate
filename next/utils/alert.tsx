import { notification } from "antd";

export function successMsg(title: string, message: string) {
	notification.success({
		message: title,
		description: message,
	});
}

export function errorMsg(title: string, message: string) {
	notification.error({
		message: title,
		description: message,
	});
}

export function warnMsg(title: string, message: string) {
	notification.warning({
		message: title,
		description: message,
	});
}

export function infoMsg(title: string, message: string) {
	notification.info({
		message: title,
		description: message,
	});
}
