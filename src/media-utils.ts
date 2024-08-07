import {
	MEDIA_CACHED,
	type MethodsWithMediaUpload,
	getFileHash,
	isFile,
} from "./utils.js";

/** Map of Methods and cache utils for params */
export const MEDIA_HELPERS = {
	sendPhoto: [
		async (params, storage) => {
			if (isFile(params.photo)) {
				const file = await params.photo;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.photo = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.photo) {
				// @ts-expect-error
				const hash = await getFileHash(params.photo);
				await storage.set(hash, response.photo.at(-1)!.file_id);
			}
		},
	],
	sendAudio: [
		async (params, storage) => {
			if (isFile(params.audio)) {
				const file = await params.audio;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.audio = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.audio) {
				// @ts-expect-error
				const hash = await getFileHash(params.audio);
				await storage.set(hash, response.audio.file_id);
			}
		},
	],
	sendDocument: [
		async (params, storage) => {
			if (isFile(params.document)) {
				const file = await params.document;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.document = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.document) {
				// @ts-expect-error
				const hash = await getFileHash(params.document);
				await storage.set(hash, response.document.file_id);
			}
		},
	],
	sendVideo: [
		async (params, storage) => {
			if (isFile(params.video)) {
				const file = await params.video;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.video = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.video) {
				// @ts-expect-error
				const hash = await getFileHash(params.video);
				await storage.set(hash, response.video.file_id);
			}
		},
	],
	sendAnimation: [
		async (params, storage) => {
			if (isFile(params.animation)) {
				const file = await params.animation;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.animation = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.animation) {
				// @ts-expect-error
				const hash = await getFileHash(params.animation);
				await storage.set(hash, response.animation.file_id);
			}
		},
	],
	sendVoice: [
		async (params, storage) => {
			if (isFile(params.voice)) {
				const file = await params.voice;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.voice = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.voice) {
				// @ts-expect-error
				const hash = await getFileHash(params.voice);
				await storage.set(hash, response.voice.file_id);
			}
		},
	],
	sendVideoNote: [
		async (params, storage) => {
			if (isFile(params.video_note)) {
				const file = await params.video_note;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.video_note = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.video_note) {
				// @ts-expect-error
				const hash = await getFileHash(params.video_note);
				await storage.set(hash, response.video_note.file_id);
			}
		},
	],
	sendPaidMedia: [
		async (params, storage) => {
			// TODO: for cycle

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			// TODO: for cycle
		},
	],
	sendMediaGroup: [
		async (params, storage) => {
			// TODO: for cycle

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			// TODO: for cycle
		},
	],
	sendPoll: [
		async (params, storage) => {
			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;
		},
	],
	editMessageMedia: [
		async (params, storage) => {
			if ("media" in params.media && isFile(params.media.media)) {
				const file = await params.media.media;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.media.media = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			const fileKey = response[params.media.type];

			if (fileKey) {
				// @ts-expect-error
				const hash = await getFileHash(params.media.media);
				await storage.set(
					hash,
					Array.isArray(fileKey) ? fileKey.at(-1)?.file_id : fileKey?.file_id,
				);
			}
		},
	],
	sendSticker: [
		async (params, storage) => {
			if (isFile(params.sticker)) {
				const file = await params.sticker;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.sticker = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			if (response.sticker) {
				// @ts-expect-error
				const hash = await getFileHash(params.sticker);
				await storage.set(hash, response.sticker.file_id);
			}
		},
	],
	uploadStickerFile: [
		async (params, storage) => {
			if (isFile(params.sticker)) {
				const file = await params.sticker;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process
					// @ts-expect-error
					params[MEDIA_CACHED] = file;
					// @ts-ignore
					params.sticker = fileId;
				}
			}

			return params;
		},
		async (response, params, storage) => {
			// @ts-expect-error
			if (typeof response !== "object" || !params[MEDIA_CACHED]) return;

			// @ts-expect-error
			const hash = await getFileHash(params[MEDIA_CACHED]);
			await storage.set(hash, response.file_id);
		},
	],
} satisfies MethodsWithMediaUpload;
