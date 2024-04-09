import { createHash } from "node:crypto";
import { type Storage, inMemoryStorage } from "@gramio/storage";
import { Plugin } from "gramio";
import { MEDIA_HELPERS } from "./media-utils";

export function getHashFromFile(file: File) {
	return createHash("md5")
		.update(file.name + file.size + file.type)
		.digest("hex");
}

export const IS_MEDIA_CACHED = Symbol("IS_MEDIA_CACHED");

export interface MediaCacherOptions {
	storage?: Storage;
}

const methods = Object.keys(MEDIA_HELPERS) as (keyof typeof MEDIA_HELPERS)[];

export function mediaCacher(options: MediaCacherOptions = {}) {
	const storage = options.storage ?? inMemoryStorage();

	return new Plugin("@gramio/media-cacher")
		.preRequest(methods, async (context) => {
			const [preRequest] = MEDIA_HELPERS[context.method];

			// @ts-ignore
			preRequest(context.params, storage);

			return context;
		})
		.group((bot) =>
			bot.onResponse(methods, async ({ method, params, response }) => {
				// @ts-expect-error Symbol
				if (params?.[IS_MEDIA_CACHED]) {
					const [_, onResponse] = MEDIA_HELPERS[method];

					// @ts-ignore
					onResponse(params, storage);
				}
			}),
		);
}
