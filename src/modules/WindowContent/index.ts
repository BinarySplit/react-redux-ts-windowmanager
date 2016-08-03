import AboutThisSite from "./components/AboutThisSite";
import Folder from "./components/Folder";
import CVSkills from "./components/CVSkills"
import ComponentClass = __React.ComponentClass;
import SFC = __React.SFC;
import ClassType = __React.ClassType;

//TODO: Lazy-load these
export const windowContentTypes: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>} ={
    AboutThisSite,
    CVSkills,
    Folder
};