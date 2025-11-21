// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iconsData from "icons";

const iconPrefix = "sa-svg-";
function getIconSymbolTemplate(iconId: string, iconSvg: string): string {
  const startStr = "<svg ";
  const endStr = "</svg>";
  iconSvg = iconSvg.trim();
  const str = iconSvg.toLowerCase();

  if(str.substring(0, startStr.length) === startStr &&
    str.substring(str.length - endStr.length, str.length) === endStr) {
    return "<symbol " +
    "id=\"" + iconPrefix + iconId + "\" " +
    iconSvg.substring(startStr.length, str.length - endStr.length) +
      "</symbol>";
  }
}

const iconsHtml = Object.keys(iconsData).map(iconId => getIconSymbolTemplate(iconId, iconsData[iconId]));
const svgTemplate = `<svg style="display:none;">${iconsHtml}<svg>`;
export { svgTemplate };