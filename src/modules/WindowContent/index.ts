import AboutThisSite from "./components/AboutThisSite";
import Folder from "./components/Folder";
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;
import "./windowContentStyle.less";

export const windowContentTypes: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>} ={
    AboutThisSite,
    Folder
};