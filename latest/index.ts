import { resolve } from "path";
import { intro, note, outro, spinner } from '@clack/prompts';
import { bgCyan, bgGreen, bgMagenta, bgYellow, white } from 'picocolors';
import { sleep } from "bun";

const file = Bun.file(resolve('./package.json'));

if(!await file.exists()) {
	throw ('There is no package.json!');
}

async function shell(command: string, title?: string) {
	const commands = command.split(' ');
	const { stdout } = Bun.spawn(commands);
	process.stdout.write('\n'); // TODO: Remove once @clack\prompts has spacers
	return note(
		await new Response(stdout).text(),
		title
	);
}

intro(bgCyan(white('Package updater')));

const data = await file.json();

const packages = {
	dep: [...Object.keys(data.dependencies ?? {})],
	dev: [...Object.keys(data.devDependencies ?? {})],
	opt: [...Object.keys(data.optionalDependencies ?? {})]
};

const s = spinner();
s.start('Updating dependencies');

await sleep(2000);

await shell(`bun i ${packages.dep.join(' ')}`, bgYellow('Dependencies'));
await shell(`bun i --dev ${packages.dev.join(' ')}`, bgGreen('DevDependencies'));
await shell(`bun i --optional ${packages.opt.join(' ')}`, bgMagenta('OptionalDependencies'));

s.stop('Dependencies updated!');

outro('All packages updated.');
process.exit(0);
