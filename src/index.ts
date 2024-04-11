import { type Storage, inMemoryStorage } from "@gramio/storage";
import { Plugin } from "gramio";
import { MEDIA_HELPERS } from "./media-utils";
import { MEDIA_CACHED } from "./utils";

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
			context.params = await preRequest(context.params, storage);
			console.log("edited params", context.params);
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
