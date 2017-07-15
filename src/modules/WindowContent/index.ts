import AboutThisSite from "./components/AboutThisSite";
import Folder from "./components/Folder";
import CVSkills from "./components/CVSkills"
import ComponentClass = React.ComponentClass;
import SFC = React.SFC;
import ClassType = React.ClassType;

//TODO: Lazy-load these
export const windowContentTypes: {[key:string]: ComponentClass<any> | SFC<any> | ClassType<any, any, any>} ={
    AboutThisSite,
    CVSkills,
    Folder
};
