export var __assign =
  (<any>Object)["assign"] ||
  function(target: any) {
    for(var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for(var p in s)
        if(Object.prototype.hasOwnProperty.call(s, p)) target[p] = s[p];
    }
    return target;
  };

export function __extends(thisClass: any, baseClass: any) {
  for(var p in baseClass)
    if(baseClass.hasOwnProperty(p)) thisClass[p] = baseClass[p];
  function __() {
    this.constructor = thisClass;
  }
  thisClass.prototype =
    baseClass === null
      ? Object.create(baseClass)
      : ((__.prototype = baseClass.prototype), new (<any>__)());
}

export var __rest = function(source: any, e: any) {
  var result: any = {};
  for(var propertyName in source)
    if(
      Object.prototype.hasOwnProperty.call(source, propertyName) &&
      e.indexOf(propertyName) < 0
    )
      result[propertyName] = source[propertyName];
  if(
    source != null &&
    typeof (<any>Object)["getOwnPropertySymbols"] === "function"
  )
    for(
      var i = 0,
        propertySymbols = (<any>Object)["getOwnPropertySymbols"](source);
      i < propertySymbols.length;
      i++
    )
      if(e.indexOf(propertySymbols[i]) < 0)
        result[propertySymbols[i]] = source[propertySymbols[i]];
  return result;
};

declare var Reflect: any;

export var __decorate = function(
  decorators: any,
  target: any,
  key: any,
  desc: any
) {
  var c = arguments.length,
    r =
      c < 3
        ? target
        : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
    d;
  if(typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for(var i = decorators.length - 1; i >= 0; i--)
      if((d = decorators[i]))
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

export function __awaiter(thisArg: any, _arguments: any, P: any, generator: any) {
  function adopt(value: any) { return value instanceof P ? value : new P(function (resolve: any) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve: any, reject: any) {
    function fulfilled(value: any) { try { step(generator.next(value)); } catch(e) { reject(e); } }
    function rejected(value: any) { try { step(generator["throw"](value)); } catch(e) { reject(e); } }
    function step(result: any) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

export function __generator(thisArg: any, body: any) {
  var _ = { label: 0, sent: function() { if(t[0] & 1) throw t[1]; return t[1]; }, trys: <any>[], ops: <any>[] }, f: any, y: any, t: any, g: any;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n: any) { return function (v: any) { return step([n, v]); }; }
  function step(op: any) {
    if(f) throw new TypeError("Generator is already executing.");
    while(_) try {
      if(f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if(y = 0, t) op = [op[0] & 2, t.value];
      switch(op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if(!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { (<any>_) = 0; continue; }
          if(op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if(op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if(t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if(t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch(e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if(op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

export var __spreadArrays = function () {
  for(var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for(var r = Array(s), k = 0, i = 0; i < il; i++)
    for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};

export function __spreadArray (to: any, from: any, pack: any) {
  if(pack || arguments.length === 2) for(var i = 0, l = from.length, ar: any; i < l; i++) {
    if(ar || !(i in from)) {
      if(!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}