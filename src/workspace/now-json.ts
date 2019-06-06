import { Tree, SchematicsException } from "@angular-devkit/schematics";

interface ProjectOption {
	name: string;
	outputPath: string;
}

interface Build {
	src: string;
	use: string;
}

interface Route {
	src: string;
	dest: string;
	headers: any;
}

interface NowJson {
	name: string;
	version: number;
	builds: Build[];
	routes: Route[];
}

export function generateNowJson(tree: Tree, options: ProjectOption) {
	const path = "now.json";
	const ignorePath = ".nowignore";

	const nowJson = tree.exists(path)
		? readJson(path, tree)
		: generateEmptyNowJson(options);

	if (tree.exists(ignorePath)) {
		throw new SchematicsException(`There is already .nowignore file.`);
	} else {
		createIgnoreFile(tree, ignorePath, options.outputPath);
	}

	if (nowJson.builds.length > 0 || nowJson.routes.length > 0) {
		// TODO: what to do if now.json has already defined routes and builders
		throw new SchematicsException(`There is already now.json config file.`);
	}

	nowJson.builds.push({
		src: `${options.outputPath}/**`,
		use: "@now/static"
	});
	nowJson.routes.push(
		{
			src: "/(.*)",
			headers: { "cache-control": "max-age=31536000,immutable" },
			dest: `${options.outputPath}/$1`
		},
		{
			src: "/",
			headers: { "cache-control": "public,max-age=0,must-revalidate" },
			dest: `${options.outputPath}/index.html`
		}
	);

	saveJson(path, tree, JSON.stringify(nowJson, null, 2));
}

function generateEmptyNowJson(options: ProjectOption): NowJson {
	return {
		version: 2,
		name: options.name,
		builds: [],
		routes: []
	};
}

function readJson(path: string, tree: Tree): NowJson {
	try {
		const json = tree.read(path);
		if (!json) {
			throw new Error();
		}
		return JSON.parse(json.toString());
	} catch (e) {
		throw new SchematicsException(
			`Error when parsing ${path}: ${e.message}`
		);
	}
}

function saveJson(path: string, tree: Tree, json: string) {
	if (tree.exists(path)) {
		tree.overwrite(path, json);
	} else {
		tree.create(path, json);
	}
}

function createIgnoreFile(tree: Tree, path: string, outputPath: string) {
	tree.create(path, `!${outputPath}\n`);
}
