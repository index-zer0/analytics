import React from "react";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
} from "react-simple-maps";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
    .domain([0.29, 0.68])
    .range(["#ffedea", "#FFE70A"] as any);

interface MapProps {
    data: Record<string, number>;
    total: number;
    width?: number;
    height?: number;
}

const Map = ({ data, total, ...props }: MapProps): JSX.Element => {
    return (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={{
                scale: 100,
                center: [0, 30],
            }}
            {...props}
        >
            <Graticule stroke="#F5F4F6" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const d = data[geo.properties.NAME]; //NAME_LONG, FORMAL_EN
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={
                                    d
                                        ? (colorScale(d / total) as any)
                                        : "#F5F4F6"
                                }
                                stroke="black"
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    );
};

export default Map;
