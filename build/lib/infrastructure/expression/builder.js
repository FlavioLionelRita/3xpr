"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionsBuilder = void 0;
const h3lp_1 = require("h3lp");
const application_1 = require("../../application");
const expressionsAdapter_1 = require("./expressionsAdapter");
// eslint-disable-next-line no-use-before-define
class ExpressionsBuilder {
    build() {
        const model = new application_1.ModelService();
        const typeManager = new application_1.TypeService(model);
        const parameterManager = new application_1.ParameterService();
        const cache = new h3lp_1.MemoryCache();
        return new expressionsAdapter_1.ExpressionsAdapter(model, typeManager, parameterManager, cache);
    }
}
exports.ExpressionsBuilder = ExpressionsBuilder;
//# sourceMappingURL=builder.js.map