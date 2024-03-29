import React from "react";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Graticule,
    // @ts-ignore
    useZoomPan,
} from "react-simple-maps";
import getCountryIS02 from "country-iso-3-to-2";
import { isoToName } from "../utils";

const colorScale = scaleLinear()
    .domain([0, 1])
    .range(["#ffedea", "#16c5e5"] as any);

interface MapProps {
    data: Record<string, number>;
    total: number;
    width: number;
    height: number;
}

interface ZoomableProps {
    children: JSX.Element[] | JSX.Element;
    width: number;
    height: number;
    center: [number, number];
    zoom: number;
}

const CustomZoomableGroup = ({
    width,
    height,
    children,
    ...props
}: ZoomableProps) => {
    const { mapRef, transformString } = useZoomPan(props);
    return (
        <g ref={mapRef}>
            <rect width={width} height={height} fill="transparent" />
            <g transform={transformString}>{children}</g>
        </g>
    );
};

const Map = ({
    data,
    total,
    width,
    height,
    ...props
}: MapProps): JSX.Element => {
    return (
        <ComposableMap projection="geoMercator" {...props}>
            <CustomZoomableGroup
                center={[0, 30]}
                zoom={0.8}
                width={width}
                height={height}
            >
                <Graticule stroke="#F5F4F6" strokeWidth={0.5} />
                <Geographies geography="/features.json">
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const d = data[getCountryIS02(geo.id)];
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
                                    style={{
                                        hover: { outline: "none" },
                                        pressed: {
                                            outline: "none",
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </CustomZoomableGroup>
        </ComposableMap>
    );
};

export default Map;
