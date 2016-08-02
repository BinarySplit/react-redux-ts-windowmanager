import {AboutThisSiteComponent} from "./components/AboutThisSite";
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;


export const windowContentTypes: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>} ={
    AboutThisSite: AboutThisSiteComponent
};