export interface IKeyDefinition {
    key: string;
    transform: Function;
}
export interface IMapData {
    transform: Object;
    multiMaps: IMapping[];
}
export interface IMapFactory {
    (stringOrArray: string | string[]): IMapping;
    map(stringOrArray: string | string[]): IMapping;
    execute(source: any, destination?: any): any;
    each(sourceArray: any[]): any;
}
export interface IMapping {
    orMode: boolean;
    source: string | string[];
    target: string;
    transform?: Function;
    to(target: string, fnc?: Function): any;
    map(stringOrArray: string | string[]): IMapping;
    or(source: string): any;
    execute(source: any, destination?: any): any;
    each(sourceArray: any[]): any;
}
export interface IOptions {
  experimental?: boolean;
  alwaysTransform?: boolean;
  alwaysSet?: boolean;
}
