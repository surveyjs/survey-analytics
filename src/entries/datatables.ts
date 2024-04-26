export * from "../localizationManager";

//localization
import "../analytics-localization/farsi";
import "../analytics-localization/french";
import "../analytics-localization/german";
import "../analytics-localization/norwegian";
import "../analytics-localization/portuguese";
import "../analytics-localization/russian";
import "../analytics-localization/dutch";
import "../analytics-localization/arabic";
import "../analytics-localization/japanese";

//extensions
import "../tables/extensions/rowextensions";
import "../tables/extensions/headerextensions";
import "../tables/extensions/columnextensions";
import "../tables/extensions/detailsextensions";

export * from "../tables/table";
export * from "../tables/datatables";
export { TableExtensions } from "../tables/extensions/tableextensions";
export { DocumentHelper } from "../utils/index";
