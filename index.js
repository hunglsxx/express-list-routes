const path = require('path');

const COLORS = {
    yellow: 33,
    green: 32,
    blue: 34,
    red: 31,
    grey: 90,
    magenta: 35,
    clear: 39,
};
const spacer = (x) => (x > 0 ? [...new Array(x)].map(() => ' ').join('') : '');
const colorText = (color, string) => `\u001b[${color}m${string}\u001b[${COLORS.clear}m`;

var routerList = [];

function colorMethod(method) {
    switch (method) {
        case 'POST':
            return colorText(COLORS.yellow, method);
        case 'GET':
            return colorText(COLORS.green, method);
        case 'PUT':
            return colorText(COLORS.blue, method);
        case 'DELETE':
            return colorText(COLORS.red, method);
        case 'PATCH':
            return colorText(COLORS.grey, method);
        default:
            return method;
    }
}

function getPathFromRegex(regexp) {
    return regexp.toString().replace('/^', '').replace('?(?=\\/|$)/i', '').replace(/\\\//g, '/');
}

function combineStacks(acc, stack) {
    if (stack.handle.stack) {
        const routerPath = getPathFromRegex(stack.regexp);
        return [...acc, ...stack.handle.stack.map((stack) => ({ routerPath, ...stack }))];
    }
    return [...acc, stack];
}

function getStacks(app) {
    // Express 3
    if (app.routes) {
        // convert to express 4
        return Object.keys(app.routes)
            .reduce((acc, method) => [...acc, ...app.routes[method]], [])
            .map((route) => ({ route: { stack: [route] } }));
    }

    // Express 4
    if (app._router && app._router.stack) {
        return app._router.stack.reduce(combineStacks, []);
    }

    // Express 4 Router
    if (app.stack) {
        return app.stack.reduce(combineStacks, []);
    }

    // Express 5
    if (app.router && app.router.stack) {
        return app.router.stack.reduce(combineStacks, []);
    }

    return [];
}

function expressListRoutes(options) {
    this.defaultOptions = {
        prefix: '',
        spacer: 7,
        showLog: true
    };
    if (options) this.defaultOptions = options;
}

expressListRoutes.prototype.discover = function discover(app, opts) {
    try {
        const stacks = getStacks(app);
        const options = { ...this.defaultOptions, ...opts };

        if (stacks) {
            for (const stack of stacks) {
                if (stack.route) {
                    const routeLogged = {};
                    for (const route of stack.route.stack) {
                        const method = route.method ? route.method.toUpperCase() : null;
                        if (!routeLogged[method] && method) {
                            const stackMethod = colorMethod(method);
                            const stackSpace = spacer(options.spacer - method.length);
                            const stackPath = path.resolve(
                                [options.prefix, stack.routerPath, stack.route.path, route.path].filter((s) => !!s).join(''),
                            );
                            if (options.showLog) console.info(stackMethod, stackSpace, stackPath);
                            routeLogged[method] = true;
                            routerList.push({ method, stackPath });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

expressListRoutes.prototype.getRoutes = function getRoutes() {
    return routerList;
}

module.exports = expressListRoutes;
