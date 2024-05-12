import { type Storage, inMemoryStorage } from "@gramio/storage";
import { Plugin } from "gramio";
import { MEDIA_HELPERS } from "./media-utils";
import { MEDIA_CACHED } from "./utils";

/** Options for {@link mediaCache} Plugin */
export interface MediaCacheOptions {
	/**
	 * The {@link Storage} in which to store the cached `file_id`
	 *
	 * [Documentation](https://gramio.netlify.app/storages/)
	 */
	storage?: Storage;
}

const methods = Object.keys(MEDIA_HELPERS) as (keyof typeof MEDIA_HELPERS)[];

/**
 * `Media cache` plugin for [GramIO](https://gramio.netlify.app/).
 *
 * This plugin caches the sent `file_id`'s and prevents files from being uploaded again.
 *
 * Currently, **sendMediaGroup** is not cached.
 * @example
 * ```ts
 * import { Bot } from "gramio";
 * import { mediaCache } from "@gramio/media-cache";
 *
 * const bot = new Bot(process.env.token!)
 *     .extend(mediaCache())
 *     .command("start", async (context) => {
 *         return context.sendDocument(
 *             MediaUpload.url(
 *                 "https://raw.githubusercontent.com/gramiojs/types/main/README.md"
 *             )
 *         );
 *     })
 *     .onStart(console.log);
 *
 * bot.start();
 * ```
 */
export function mediaCache(options: MediaCacheOptions = {}): Plugin {
	const storage = options.storage ?? inMemoryStorage();

	return new Plugin("@gramio/media-cacher")
		.preRequest(methods, async (context) => {
			const [preRequest] = MEDIA_HELPERS[context.method];

			// @ts-ignore
			context.params = await preRequest(context.params, storage);

			return context;
		})
		.group((bot) =>
			bot.onResponse(methods, async ({ method, params, response }) => {
				// @ts-expect-error Symbol
				if (!params?.[MEDIA_CACHED]) {
					const [_, onResponse] = MEDIA_HELPERS[method];

					// @ts-ignore
					await onResponse(response, params, storage);
				}
			}),
		);
}
