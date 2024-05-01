import fs from "node:fs/promises";
import type { APIMethods } from "@gramio/types";
import prettier from "prettier";
import type { IBotApi } from "./types";

const SCHEMA_FILE_PATH = "./tg-bot-api/public/dev/custom.min.json";

const schemaFile = await fs.readFile(SCHEMA_FILE_PATH);
const schema = JSON.parse(String(schemaFile)) as IBotApi.ISchema;

const methods: Partial<
	Record<
		keyof APIMethods,
		[
			IBotApi.IArgument,
			{ name: string; type?: "array" | "union"; property?: string }[],
		]
	>
> = {};

function resolveReference(name: string) {
	const telegramObject = schema.objects.find((x) => x.name === name);

	if (!telegramObject) return [false, false] as const;
	return [
		(telegramObject?.properties ||
			telegramObject.any_of) as IBotApi.IArgument[],
		"properties" in telegramObject ? "properties" : "any_of",
	] as const;
}

function findInputFileInArguments(
	methodArguments: IBotApi.IArgument[],
	argumentName?: string,
) {
	const fileArguments: NonNullable<(typeof methods)["addStickerToSet"]>[1] = [];
	if (!methodArguments?.length) return [];

	for (const argument of methodArguments) {
		if (
			argument.description?.includes(
				"can't be reused and can be only uploaded as a new file",
			)
		)
			continue;

		if (
			argument.reference === "InputFile" ||
			(argument.type === "string" && argument.name === "media")
		)
			fileArguments.push({
				name: argumentName ?? argument.name,
			});

		if (argument.any_of)
			fileArguments.push(
				...findInputFileInArguments(argument.any_of, argument.name),
			);

		if (argument.reference && argument.reference !== "InputFile") {
			const [referenceArguments, type] = resolveReference(argument.reference);

			if (referenceArguments && type)
				fileArguments.push(
					...findInputFileInArguments(referenceArguments).map((x) => ({
						name: x.name,
						property: argument.name,
						type: type === "any_of" ? ("union" as const) : undefined,
					})),
				);
		}

		if (argument.array)
			fileArguments.push(
				...findInputFileInArguments([argument.array], argument.name).map(
					(x) =>
						({
							name: x.name,
							type: "array",
							property: argument.name,
						}) as const,
				),
			);
	}

	return fileArguments;
}

for (const method of schema.methods) {
	if (
		method.multipart_only &&
		method.arguments?.length &&
		method.return_type.type !== "bool"
	) {
		// [INFO] Find only unique values (inspired by https://yagisanatode.com/get-a-unique-list-of-objects-in-an-array-of-object-in-javascript/)
		methods[method.name] = [
			method.return_type,
			[
				...new Map(
					findInputFileInArguments(method.arguments).map((item) => [
						item.name,
						item,
					]),
				).values(),
			],
		];
	}
}

fs.writeFile(
	"./src/media-utils.ts",
	await prettier.format(
		/* ts */ `
        import { type MethodsWithMediaUpload, getFileHash, isFile, MEDIA_CACHED } from "utils";

        export const MEDIA_HELPERS = {${Object.entries(methods)
					.map(([method, [returnType, value]]) => {
						return /* ts */ `${method}: [async (params, storage) => {
                            ${value
															.map((x) => {
																if (x.type === "array")
																	return "// TODO: for cycle";

																return /* ts */ `if(${
																	x.type === "union"
																		? `"${x.name}" in params${
																				x.property ? `.${x.property}` : ""
																			} && `
																		: ""
																}isFile(params.${
																	x.property
																		? `${x.property}.${x.name}`
																		: `${x.name}`
																})) {
                                                                    const file = await params.${
																																			x.property
																																				? `${x.property}.${x.name}`
																																				: `${x.name}`
																																		}
                                                                     const hash = await getFileHash(file);
                                                                    const fileId = await storage.get<string>(hash);
                                                                    if(fileId) {// TODO: need process
																	// @ts-expect-error
																		params[MEDIA_CACHED] = file;
                                                                        // @ts-ignore
                                                                    params.${
																																			x.property
																																				? `${x.property}.${x.name}`
																																				: `${x.name}`
																																		} = fileId;
                                                                                                                                    }
                                                                }`;
															})
															.join("\n")}
                        
                                                    return params;
                                                        }, async (response, params, storage) => {
															// @ts-expect-error
															if(typeof response !== "object" || !params[MEDIA_CACHED]) return;
	
															${
																returnType.reference === "File"
																	? /* ts */ `
																	// @ts-expect-error
																	const hash = await getFileHash(params[MEDIA_CACHED]);
																	await storage.set(hash, response.file_id)`
																	: value.map((x) => {
																			if (x.type === "array")
																				return "// TODO: for cycle";

																			if (method === "editMessageMedia")
																				return /* ts */ `const fileKey = response[params.media.type];
																			
																			if(fileKey) {
																			// @ts-expect-error
																	const hash = await getFileHash(params.${
																		x.property
																			? `${x.property}.${x.name}`
																			: `${x.name}`
																	});
                                                                    await storage.set(hash, Array.isArray(fileKey) ? fileKey.at(-1)?.file_id : fileKey?.file_id) 
																	}`;

																			return /* ts */ `if(response.${
																				x.property
																					? `${x.property}.${x.name}`
																					: `${x.name}`
																			}) {
																	// @ts-expect-error
																	const hash = await getFileHash(params.${
																		x.property
																			? `${x.property}.${x.name}`
																			: `${x.name}`
																	});
                                                                    await storage.set(hash, response${
																																			x.name ===
																																			"photo"
																																				? `.${x.name}.at(-1)!`
																																				: x.property
																																					? `.${x.property}.${x.name}`
																																					: `.${x.name}`
																																		}.file_id);
																}`;
																		})
															}
														}]`;
					})
					.join(",\n")}
                } satisfies MethodsWithMediaUpload;
        `,
		{
			tabWidth: 4,
			parser: "typescript",
			endOfLine: "auto",
			semi: false,
		},
	),
);
