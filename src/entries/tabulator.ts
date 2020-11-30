export * from "../localizationManager";

//localization
import "../localization/farsi";
import "../localization/french";
import "../localization/norwegian";
import "../localization/russian";
import "../localization/dutch";

//extensions
import "../tables/extensions/rowextensions";
import "../tables/extensions/headerextensions";
import "../tables/extensions/columnextensions";
import "../tables/extensions/detailsextensions";

export * from "../tables/tabulator";
export { TableExtensions } from "../tables/extensions/tableextensions";
export { DocumentHelper } from "../utils/index";
