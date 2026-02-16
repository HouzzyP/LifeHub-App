import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const uiPath = path.join(root, 'src', 'constants', 'ui.ts');
const pkgPath = path.join(root, 'package.json');
const outputPath = path.join(root, 'context', 'context.json');

const readFileSafe = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return '';
    }
};

const parseUnionValues = (content, typeName) => {
    const typeRegex = new RegExp(`type ${typeName} = ([^;]+);`);
    const match = content.match(typeRegex);
    if (!match) return [];
    const unionPart = match[1];
    const values = [];
    const valueRegex = /'([^']+)'/g;
    let valueMatch;
    while ((valueMatch = valueRegex.exec(unionPart)) !== null) {
        values.push(valueMatch[1]);
    }
    return values;
};

const getGitStatus = () => {
    try {
        return execSync('git status -sb', { encoding: 'utf8' }).trim();
    } catch {
        return 'git status unavailable';
    }
};

const getChangedFiles = () => {
    try {
        const output = execSync('git status -sb --porcelain', { encoding: 'utf8' });
        return output
            .trim()
            .split('\n')
            .filter(Boolean)
            .map((line) => line.slice(3).trim());
    } catch {
        return [];
    }
};

const getPackageInfo = () => {
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return {
            name: pkg.name ?? 'unknown',
            version: pkg.version ?? '0.0.0',
        };
    } catch {
        return { name: 'unknown', version: '0.0.0' };
    }
};

const appContent = readFileSafe(appPath);
const uiContent = readFileSafe(uiPath);
const existingContextRaw = readFileSafe(outputPath);
let existingContext = {};
try {
    existingContext = existingContextRaw ? JSON.parse(existingContextRaw) : {};
} catch {
    existingContext = {};
}

const contextSnapshot = {
    updatedAt: new Date().toISOString(),
    project: getPackageInfo(),
    locales: parseUnionValues(uiContent, 'Locale'),
    modules: parseUnionValues(appContent, 'AppModule'),
    paths: {
        app: 'src/App.tsx',
        strings: 'src/constants/ui.ts',
        notes: 'src/modules/notes',
        habits: 'src/modules/habits',
        dashboard: 'src/modules/dashboard',
    },
    git: {
        status: getGitStatus(),
        changedFiles: getChangedFiles(),
    },
    decisions: Array.isArray(existingContext.decisions) ? existingContext.decisions : [],
    assumptions: Array.isArray(existingContext.assumptions) ? existingContext.assumptions : [],
    pending: Array.isArray(existingContext.pending) ? existingContext.pending : [],
    promptHints: Array.isArray(existingContext.promptHints) ? existingContext.promptHints : [],
    notes: Array.isArray(existingContext.notes) ? existingContext.notes : [],
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(contextSnapshot, null, 2));
console.log(`[context] snapshot written to ${path.relative(root, outputPath)}`);
