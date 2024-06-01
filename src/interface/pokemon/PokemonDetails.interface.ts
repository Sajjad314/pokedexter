export interface IPokemonDetails{
    id:number;
    name:string;
    abilities:string[];
    image:string;
    weight:number;
    height:number;
    type:string[];
    stats:{name:string;basicStat:number}[];
}