import * as React from 'react';
import "../styles/cv-skills.less";
import {memoizeMethodWithKey} from "../../../utils/memoize";

const tileWidth = 100;
const tileHeight = 50;
const tileBorderHeight = 4;
const tileMargin = 25;
const treeWidth = 100;
const treeStride = treeWidth / 3;
const spaceHeight = 400;

interface Tile { group: string, subgroup?: number, title: string };
let tiles: Tile[] = [
    {group: null, title: "Skills"},
    {group: "Skills", subgroup: 1, title: "Client-Side"},
    {group: "Skills", subgroup: 1, title: "Server-Side"},
    {group: "Skills", subgroup: 1, title: "Database"},
    {group: "Skills", title: "DevOps"},
    {group: "Skills", title: "Software Quality"},
    {group: "Client-Side", title: "JavaScript / HTML / CSS"},
    {group: "Client-Side", title: "Backbone"},
    {group: "Client-Side", title: "React / Redux"},
];

let tilesByTitle: {[title:string]: Tile} = {};
tiles.forEach(t=>tilesByTitle[t.title] = t);

let tilesByGroup: {[group:string]: Tile[]} = {};
tiles.forEach(t=>(tilesByGroup[t.group] || (tilesByGroup[t.group] = [])).push(t));

/** Returns a path from the root node to the tile (including both the root node and tile) */
function getPathToTile(tileTitle: string) {
    let path = [tileTitle];
    let tile = tilesByTitle[tileTitle];
    while(tile = tilesByTitle[tile.group])
        path.unshift(tile.title);
    path.unshift(null);
    return path;
}

interface TilePos {top: number, mid: number, bottom: number}
function getTilePositions(baseY: number, numTiles: number): TilePos[] {
    let totalHeight = numTiles * tileHeight + (numTiles - 1) * tileMargin;
    let centerY = baseY;
    //Push centerY up/down so that tiles fit in space. If there is overflow, spill over the bottom.
    let bottomSlack = spaceHeight - centerY - (totalHeight/2);
    if(bottomSlack < 0) centerY += bottomSlack;

    let topSlack = centerY - (totalHeight/2);
    if(topSlack < 0) centerY -= topSlack;

    let y = centerY - totalHeight/2;
    let tiles: TilePos[] = [];
    for(let i = 0; i < numTiles; i++) {
        tiles.push({ top: y, mid: y + tileHeight/2, bottom: y + tileHeight });
        y += tileHeight + tileMargin;
    }
    return tiles;
}

function getTileChildGraph(baseY: number, tiles: Tile[], tilePositions: TilePos[]): number[][] {
    //Cluster by subgroup
    let ys:number[][] = [];
    for(let i = 0; i < tiles.length; i++) {
        if(i == 0 || tiles[i].subgroup == null || tiles[i].subgroup != tiles[i-1].subgroup) {
            ys.push([tilePositions[i].mid]);
        } else {
            ys[ys.length - 1].push(tilePositions[i].mid);
        }
    }
    let paths:number[][] = [];
    for(let i = 0; i < ys.length; i++) {
        let avg = ys[i].reduce((a,b)=>a+b) / ys[i].length;
        for(let j = 0; j < ys[i].length; j++) {
            paths.push([baseY, avg, ys[i][j]]);
        }
    }
    return paths;
}

interface SvgBlockyTreeProps {yPaths: number[][]}
function SvgBlockyTree({yPaths}: SvgBlockyTreeProps) {
    let d = yPaths.map(path => {
        let ds = [`M 0 ${path[0]} H ${treeStride}`];
        for(var i = 1; i < path.length; i++) {
            ds.push(`V ${path[i]} H ${(i + 1) * treeStride}`);
        }
        return ds.join(' ');
    }).join(' ');
    return <svg className="cv-skills-tree"><path d={d} stroke="black" fill="transparent" /></svg>;
}

interface SkillTileListProps {tiles: Tile[], positions: TilePos[]}
function SkillTileList({tiles, positions}: SkillTileListProps) {
    return <div className="cv-skills-tiles">
        {tiles.map((t, i) => {
            let height = tileHeight - 2 * tileBorderHeight;
            let style = { top: positions[i].top, height: `${height}px`, lineHeight: `${height-2}px` };

            return <div key={i} className="cv-skills-tile" style={style}>
                <div className="cv-skills-tile-text">
                    {t.title}
                </div>
            </div>;
        })}
    </div>
}

interface Layer {group: string, baseY: number}
interface CVSkillsState {
    currentTileTitle: string
}

export default class CVSkills extends React.Component<void, CVSkillsState> {
    constructor(props:any) {
        super(props);
        this.state = {currentTileTitle: "Client-Side"};
    }
    @memoizeMethodWithKey
    onSelectGroupFn(key: string, layers: Layer[]) {
        return function() {
            this.setState({layers});
        };
    }

    render() {
        let {currentTileTitle} = this.state;
        let path = getPathToTile(currentTileTitle);

        let baseY = spaceHeight / 2;
        let elements:any[] = [];
        //Render root node
        // {
        //     let rootTiles = tilesByGroup[null];
        //     let rootPositions = getTilePositions(baseY, rootTiles.length);
        //     let rootGraph = getTileChildGraph(baseY, rootTiles, rootPositions);
        //     elements.push(<SvgBlockyTree key={"tree root"} yPaths={rootGraph}/>);
        //     elements.push(<SkillTileList key={"tiles root"} tiles={rootTiles} positions={rootPositions}/>);
        //
        //     let nextIdx = rootTiles.findIndex(t => t.title == path[0]);
        //     if(nextIdx != -1) {
        //         baseY = rootPositions[nextIdx].mid;
        //     }
        // }
        //For each node up to and including the selected tile, render the blocky-tree, then render that node's children
        for (let i = 0; i < path.length; i++) {
            let groupTiles = tilesByGroup[path[i]];
            let childPositions = getTilePositions(baseY, groupTiles.length);
            if(path[i] != null) {
                let childGraph = getTileChildGraph(baseY, groupTiles, childPositions);
                elements.push(<SvgBlockyTree key={"tree " + path[i]} yPaths={childGraph}/>);
            }
            elements.push(<SkillTileList key={"tiles " + path[i]} tiles={groupTiles} positions={childPositions}/>);
            if(i + 1 < path.length) {
                let nextIdx = groupTiles.findIndex(t => t.title == path[i+1]);
                if(nextIdx != -1) {
                    baseY = childPositions[nextIdx].mid;
                }
            }
        }

        return <div className="cv-skills">
            {elements}
        </div>;
    }
}