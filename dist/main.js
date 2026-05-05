"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const ALLOWED_ORIGINS = [
    'https://gizisnap.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
];
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(require('express').json({ limit: '50mb' }));
    app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
    app.use((req, res, next) => {
        const origin = req.headers.origin || '';
        const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
            /\.vercel\.app$/.test(origin) ||
            origin === '';
        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin || '*');
        }
        else {
            res.header('Access-Control-Allow-Origin', 'https://gizisnap.vercel.app');
        }
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map