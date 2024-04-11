import {
	IS_MEDIA_CACHED,
	type MethodsWithMediaUpload,
	getFileHash,
	isFile,
} from "utils";

export const MEDIA_HELPERS = {
	sendPhoto: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.photo)) {
				const file = await params.photo;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.photo = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendAudio: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.audio)) {
				const file = await params.audio;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.audio = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendDocument: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.document)) {
				const file = await params.document;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.document = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendVideo: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.video)) {
				const file = await params.video;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.video = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendAnimation: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.animation)) {
				const file = await params.animation;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.animation = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendVoice: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.voice)) {
				const file = await params.voice;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.voice = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendVideoNote: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.video_note)) {
				const file = await params.video_note;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.video_note = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendMediaGroup: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			// TODO: for cycle

			return params;
		},
		(response, storage) => {},
	],
	editMessageMedia: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if ("media" in params.media && isFile(params.media.media)) {
				const file = await params.media.media;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.media.media = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	sendSticker: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.sticker)) {
				const file = await params.sticker;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.sticker = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
	uploadStickerFile: [
		async (params, storage) => {
			// @ts-expect-error
			params[IS_MEDIA_CACHED] = true;
			if (isFile(params.sticker)) {
				const file = await params.sticker;
				const hash = await getFileHash(file);
				const fileId = await storage.get<string>(hash);
				if (fileId) {
					// TODO: need process

					// @ts-expect-error
					params.sticker = fileId;
				}
			}

			return params;
		},
		(response, storage) => {},
	],
} satisfies MethodsWithMediaUpload;
