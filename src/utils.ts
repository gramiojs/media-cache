import { createHash } from "node:crypto";
import type { Storage } from "@gramio/storage";
import type {
	APIMethodParams,
	APIMethodReturn,
	APIMethods,
	TelegramInputFile,
} from "@gramio/types";
import type { MaybePromise } from "gramio";

type PreHandler<Method extends keyof APIMethods> = (
	params: NonNullable<APIMethodParams<Method>>,
	storage: Storage,
) => Promise<NonNullable<APIMethodParams<Method>>>;

type onResponse<Method extends keyof APIMethods> = (
	params: APIMethodReturn<Method>,
	storage: Storage,
) => void;

export type MethodsWithMediaUpload = {
	[Method in keyof APIMethods]?: [PreHandler<Method>, onResponse<Method>];
};

export async function getFileHash(file: File) {
	console.log(file.name + file.size + (await file.text()));
	return createHash("md5")
		.update(file.name + file.size + (await file.text()))
		.digest("hex");
}

export function isFile(
	file?: TelegramInputFile | object | string,
): file is MaybePromise<File> {
	if (!file || typeof file !== "object") return false;

	return file instanceof File || file instanceof Promise;
}

export const IS_MEDIA_CACHED = Symbol("IS_MEDIA_CACHED");
