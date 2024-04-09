import type { Storage } from "@gramio/storage";
import type {
	APIMethodParams,
	APIMethods,
	TelegramInputFile,
} from "@gramio/types";

type PreHandler<Method extends keyof APIMethods> = (
	params: NonNullable<APIMethodParams<Method>>,
	storage: Storage,
) => unknown;

type MethodsWithMediaUpload = {
	[Method in keyof APIMethods]?: [PreHandler<Method>, PreHandler<Method>];
};

export function isFile(file?: TelegramInputFile | object | string) {
	if (!file || typeof file !== "object") return false;

	return file instanceof File || file instanceof Promise;
}

export const MEDIA_HELPERS = {
	setWebhook: [
		(params, storage) => {
			if (isFile(params.certificate)) {
				// todo
			}
		},
		() => {},
	],
	sendPhoto: [
		(params, storage) => {
			if (isFile(params.photo)) {
				// todo
			}
		},
		() => {},
	],
	sendAudio: [
		(params, storage) => {
			if (isFile(params.audio)) {
				// todo
			}
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendDocument: [
		(params, storage) => {
			if (isFile(params.document)) {
				// todo
			}
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendVideo: [
		(params, storage) => {
			if (isFile(params.video)) {
				// todo
			}
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendAnimation: [
		(params, storage) => {
			if (isFile(params.animation)) {
				// todo
			}
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendVoice: [
		(params, storage) => {
			if (isFile(params.voice)) {
				// todo
			}
		},
		() => {},
	],
	sendVideoNote: [
		(params, storage) => {
			if (isFile(params.video_note)) {
				// todo
			}
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendMediaGroup: [
		(params, storage) => {
			// TODO: for cycle
			// TODO: for cycle
		},
		() => {},
	],
	setChatPhoto: [
		(params, storage) => {
			if (isFile(params.photo)) {
				// todo
			}
		},
		() => {},
	],
	editMessageMedia: [
		(params, storage) => {
			if ("media" in params.media && isFile(params.media.media)) {
				// todo
			}
			if ("thumbnail" in params.media && isFile(params.media.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
	sendSticker: [
		(params, storage) => {
			if (isFile(params.sticker)) {
				// todo
			}
		},
		() => {},
	],
	uploadStickerFile: [
		(params, storage) => {
			if (isFile(params.sticker)) {
				// todo
			}
		},
		() => {},
	],
	createNewStickerSet: [
		(params, storage) => {
			// TODO: for cycle
		},
		() => {},
	],
	addStickerToSet: [
		(params, storage) => {
			if (isFile(params.sticker.sticker)) {
				// todo
			}
		},
		() => {},
	],
	replaceStickerInSet: [
		(params, storage) => {
			if (isFile(params.sticker.sticker)) {
				// todo
			}
		},
		() => {},
	],
	setStickerSetThumbnail: [
		(params, storage) => {
			if (isFile(params.thumbnail)) {
				// todo
			}
		},
		() => {},
	],
} as const satisfies MethodsWithMediaUpload;
