export * from "../localizationManager";

//localization
import "../analytics-localization/farsi";
import "../analytics-localization/french";
import "../analytics-localization/german";
import "../analytics-localization/norwegian";
import "../analytics-localization/portuguese";
import "../analytics-localization/russian";
import "../analytics-localization/dutch";
import "../analytics-localization/spanish";
import "../analytics-localization/italian";
import "../analytics-localization/arabic";
import "../analytics-localization/japanese";
import "../analytics-localization/polish";
import "../analytics-localization/finnish";
import "../analytics-localization/swedish";

//extensions
import "../tables/extensions/rowextensions";
import "../tables/extensions/headerextensions";
import "../tables/extensions/footerextensions";
import "../tables/extensions/columnextensions";
import "../tables/extensions/detailsextensions";

export * from "../tables/table";
export * from "../tables/tabulator";
export * from "../tables/columnbuilder";
export * from "../tables/columns";
export { TableExtensions } from "../tables/extensions/tableextensions";
export { DocumentHelper } from "../utils/index";

export * from "../themes/default-light";
export * from "../themes/default-dark";

import "./fonts.scss";
