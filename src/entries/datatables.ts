export * from "../localizationManager";

//localization
import "../localization/farsi";
import "../localization/french";
import "../localization/norwegian";

//extensions
import "../tables/extensions/rowextensions";
import "../tables/extensions/headerextensions";
import "../tables/extensions/columnextensions";
import "../tables/extensions/detailsextensions";

export * from "../tables/datatables";
export { TableExtensions } from "../tables/extensions/tableextensions";
export { DocumentHelper } from "../utils/index";
