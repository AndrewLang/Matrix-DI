import { IServiceContainer } from "../index";

export interface IComponent {
    ConfigureServices( services:IServiceContainer)  :void ;
    Configure():void;
}