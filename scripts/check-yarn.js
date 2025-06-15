const isYarn = process.env.npm_execpath?.includes('yarn');

if (!isYarn) {
  console.error(
    'Please use Yarn (v4.9.1+) instead of npm to install dependencies.'
  );
  process.exit(1);
}
