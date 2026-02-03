import { register } from 'tsconfig-paths';
import tsConfig from '../tsconfig.json';

// Register aliases before any other imports
register({
  baseUrl: './',
  paths: tsConfig.compilerOptions.paths,
});

// Now import your app
import { createApp } from '../src/app/create-app';

let app: any;

export default async (req: any, res: any) => {
    if (!app) {
        app = await createApp();
    }
    return app(req, res);
};