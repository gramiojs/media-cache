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
		{ name: string; type?: "array" | "union"; property?: string }[]
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
	const fileArguments: (typeof methods)["addStickerToSet"] = [];
	if (!methodArguments?.length) return [];

	for (const argument of methodArguments) {
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
			...new Map(
				findInputFileInArguments(method.arguments).map((item) => [
					item.name,
					item,
				]),
			).values(),
		];
	}
}

function getPathToInputFile(
	values: NonNullable<(typeof methods)["addStickerToSet"]>,
) {
	if (values.some((x) => x.type !== "array" && x.type !== "union"))
		return "null";

	return JSON.stringify(
		values.map((value) => ({
			name: value.name,
			property: value.property,
			type: value.type,
		})),
		null,
		2,
	);
}

fs.writeFile(
	"./src/media-utils.ts",
	// await prettier.format(
	/* ts */ `
        import { type MethodsWithMediaUpload, getFileHash, isFile, IS_MEDIA_CACHED } from "utils";

        export const MEDIA_HELPERS = {${Object.entries(methods)
					.map(([method, value]) => {
						return /* ts */ `${method}: [async (params, storage) => {
                            // @ts-expect-error
                            params[IS_MEDIA_CACHED] = true;
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
                                                        }, () => {}]`;
					})
					.join(",\n")}
                } satisfies MethodsWithMediaUpload;
        `,
	// 	{
	// 		tabWidth: 4,
	// 		parser: "typescript",
	// 		endOfLine: "auto",
	// 		semi: false,
	// 	},
	// ),
);
