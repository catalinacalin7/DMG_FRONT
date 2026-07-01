"use client";

import { useFormContext } from "react-hook-form";
import type { Panel } from "./HailEstimateManualForm";

type SvgProps = {
  tag: string | undefined;
  onPathClick: (pathId: string) => void;
};

const SvgComponent = ({ tag, onPathClick }: SvgProps) => {
  const { watch } = useFormContext();
  const hood = watch(`estimateHailPanel[0]`);
  const leftFrontFender = watch(`estimateHailPanel[1]`);
  const rightFrontFender = watch(`estimateHailPanel[2]`);
  const leftFrontDoor = watch(`estimateHailPanel[3]`);
  const rightFrontDoor = watch(`estimateHailPanel[4]`);
  const leftRearDoor = watch(`estimateHailPanel[5]`);
  const rightRearDoor = watch(`estimateHailPanel[6]`);
  const roof = watch(`estimateHailPanel[7]`);
  const leftRail = watch(`estimateHailPanel[8]`);
  const rightRail = watch(`estimateHailPanel[9]`);
  const leftQuarter = watch(`estimateHailPanel[10]`);
  const rightQuarter = watch(`estimateHailPanel[11]`);
  const trunkUp = watch(`estimateHailPanel[12]`);
  const trunkDown = watch(`estimateHailPanel[13]`);

  const dentsCount = function (item: Panel) {
    return Number(item.light) + Number(item.medium) + Number(item.strong);
  };

  const getColor = (panel: string) =>
    panel === "damaged"
      ? "#22c55e"
      : panel === "change"
        ? "#74d4ff"
        : panel === "hOff"
          ? "#99a1af"
          : "#fff";

  const handleClick = (event: React.MouseEvent<SVGGElement>) => {
    const pathId = event.currentTarget.id;
    onPathClick(pathId);
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={350}
      height={400}
      viewBox="0 0 140 190"
    >
      <defs>
        <style>
          {
            '.cls-1{fill:#434b6b}.cls-2{fill:#525878}.cls-3,.cls-4{fill:#fff}.cls-5{fill:#a7a9ac}.cls-6{letter-spacing:-.04em}.cls-7{letter-spacing:0}.cls-9{font-family:MyriadPro-Regular,"Myriad Pro",Sans-Serif;font-size:7px;fill:white;font-weight:600}.cls-91{font-family:MyriadPro-Regular,"Myriad Pro",Sans-Serif;font-size:8px;fill:white;font-weight:600}.cls-4{stroke:#000;stroke-miterlimit:10;stroke-width:.25px;}.cls-41{stroke:#175cd3}.cls-10{fill:#ef4136}.cls-12{fill:#646a8f}.cls-13{fill:#1c191a}.cls-14{fill:#878fb3}.cls-17{fill:#58595b}.cls-18{fill:#414042}.cls-19{fill:#2b2a2b}'
          }
        </style>
      </defs>
      <g id="Layer_4" data-name="Layer 4">
        <path
          d="M104.54 54.34V31.26l-3.56-7.67s-.32-8.85-5.45-12.73C90.39 6.99 83.36 3.51 70 3.51s-20.39 3.48-25.53 7.35c-5.14 3.87-5.45 12.73-5.45 12.73l-3.56 7.67v23.08l1.5 2.61v73.19l-1.5 7.03v20.95l2.49 4.23s.04 3.28 1.15 9.68c3.16 16.2 30.9 14.39 30.9 14.39s27.74 1.82 30.9-14.39c1.11-6.4 1.15-9.68 1.15-9.68l2.49-4.23v-20.95l-1.5-7.03V56.95l1.5-2.61Z"
          className="cls-12"
        />
        <path
          d="M70 3.52v182.9s27.74 1.82 30.9-14.39c1.11-6.4 1.15-9.68 1.15-9.68l2.49-4.23v-20.95l-1.5-7.03V56.95l1.5-2.61V31.26l-3.56-7.67s-.32-8.85-5.45-12.73C90.39 6.99 83.36 3.51 70 3.51Z"
          className="cls-2"
        />
        <path
          d="M70 6.78 55.06 9.3l-6.21 46.32L70 51.89V6.78z"
          className="cls-14"
        />
        <path
          d="M70 6.78 84.94 9.3l6.21 46.32L70 51.89V6.78z"
          className="cls-12"
        />
        <path
          d="M40.76 61.69s9.48 26.2 7.35 50.51c-2.13 24.3-3.16 31.93-6.09 40.47-.63-12.8-2.53-84.02-1.26-90.97Z"
          className="cls-13"
        />
        <path
          d="M70 166.74c-19.52 0-23-4.9-23-4.9l.28 15.39s-1.13 4.8 6.64 6.4c7.77 1.6 16.08 1.42 16.08 1.42v-18.32Z"
          className="cls-14"
        />
        <path
          d="M47.28 177.23s-5.43-1.51-7.31-7.09l-.52 3.31s3.32 7.01 9.09 7.6c-1.72-1.84-1.26-3.82-1.26-3.82Z"
          className="cls-10"
        />
        <path
          d="m56.33 6.96-1.26 3.56s4.98-1.86 14.94-1.86V5.1c-4.74 0-12.49 1.38-13.67 1.86Z"
          className="cls-18"
        />
        <path
          d="m54.47 8.46-.77 2.39a2.01 2.01 0 0 1-1.19 1.26c-2.67 1.04-10.51 4.43-11.93 8.8v-3.16s3.36-6.12 13.89-9.29Z"
          className="cls-5"
        />
        <path
          d="m54.47 8.46-.77 2.39c-.08.24-.21.45-.36.64S49.2 51.94 49.2 51.94l.65-.26 5.2-41.17 1.26-3.56-1.86 1.5Z"
          className="cls-2"
        />
        <path
          d="M40.58 99.87c.02 1.27.05 2.55.07 3.84l7.76 2.04v-2.44l-7.82-3.44ZM41.52 138.83l4.75-7.59c.07-.58.13-1.18.2-1.8l-5 7.73c.02.57.03 1.12.05 1.66Z"
          className="cls-19"
        />
        <path
          d="M35.46 31.26v23.08l1.5 2.61v73.19l-1.5 7.03v20.95l2.49 4.23s.04 3.28 1.15 9.68c.1.49.21.96.35 1.41l.52-3.31s-2.77-43.45-2.17-64.39c.59-20.93-.24-71.08 2.79-84.84v-3.16l-.36-.39c-1.09 3.26-1.2 6.24-1.2 6.24l-3.56 7.67Z"
          className="cls-14"
        />
        <path
          d="m39.69 66.24-4.46 1.78c-.78.31-1.45.83-1.94 1.51l-.52.71c-.4.56.12 1.31.78 1.12l5.13-1.45c.52-.15.92-.57 1.03-1.1l.09-.44.57-.17c.26-.08.48-.25.61-.48 0 0 0-.02.01-.02.47-.85-.41-1.82-1.32-1.46Z"
          className="cls-14"
        />
        <path
          d="M99.24 61.69s-9.48 26.2-7.35 50.51 3.16 31.93 6.09 40.47c.63-12.8 2.53-84.02 1.26-90.97Z"
          className="cls-13"
        />
        <path
          d="M70 166.74c19.52 0 23-4.9 23-4.9l-.28 15.39s1.13 4.8-6.64 6.4c-7.77 1.6-16.08 1.42-16.08 1.42v-18.32Z"
          className="cls-12"
        />
        <path
          d="M92.72 177.23s5.43-1.51 7.31-7.09l.52 3.31s-3.32 7.01-9.09 7.6c1.72-1.84 1.26-3.82 1.26-3.82Z"
          className="cls-10"
        />
        <path
          d="m83.67 6.96 1.26 3.56s-4.98-1.86-14.94-1.86V5.1c4.74 0 12.49 1.38 13.67 1.86Z"
          className="cls-13"
        />
        <path
          d="m85.53 8.46.77 2.39c.19.58.62 1.04 1.19 1.26 2.67 1.04 10.51 4.43 11.93 8.8v-3.16s-3.36-6.12-13.89-9.29Z"
          className="cls-5"
        />
        <path
          d="m85.53 8.46.77 2.39c.08.24.21.45.36.64s4.14 40.45 4.14 40.45l-.65-.26-5.2-41.17-1.26-3.56 1.86 1.5Z"
          className="cls-1"
        />
        <path
          d="M99.42 99.87c-.02 1.27-.05 2.55-.07 3.84l-7.76 2.04v-2.44l7.82-3.44ZM98.48 138.83l-4.75-7.59c-.07-.58-.13-1.18-.2-1.8l5 7.73c-.02.57-.03 1.12-.05 1.66Z"
          className="cls-19"
        />
        <path
          d="M104.54 31.26v23.08l-1.5 2.61v73.19l1.5 7.03v20.95l-2.49 4.23s-.04 3.28-1.15 9.68c-.1.49-.21.96-.35 1.41l-.52-3.31s2.77-43.45 2.17-64.39c-.59-20.93.24-71.08-2.79-84.84v-3.16l.36-.39c1.09 3.26 1.2 6.24 1.2 6.24l3.56 7.67Z"
          className="cls-1"
        />
        <path
          d="m100.31 66.24 4.46 1.78c.78.31 1.45.83 1.94 1.51l.52.71c.4.56-.12 1.31-.78 1.12l-5.13-1.45c-.52-.15-.92-.57-1.03-1.1l-.09-.44-.57-.17c-.26-.08-.48-.25-.62-.48 0 0 0-.02-.01-.02-.47-.85.41-1.82 1.32-1.46Z"
          className="cls-1"
        />
        <path
          d="m49.79 138.96-.47-.04c3.25-43.38-1.7-60.93-1.75-61.1l.45-.13c.05.17 5.03 17.78 1.77 61.27Z"
          className="cls-2"
        />
        <path
          d="m90.21 138.96.47-.04c-3.25-43.38 1.7-60.93 1.75-61.1l-.45-.13c-.05.17-5.03 17.78-1.77 61.27Z"
          className="cls-1"
        />
        <path
          d="M48.4 81.73s7.75-2.02 21.6-2.02V48.59s-16.62-.53-25.51 5.93c-2.25 1.72-2.61 3.08-2.25 4.21s6.17 23 6.17 23ZM49.45 136.78 47 161.84s3.48 4.9 23 4.9v-28.37s-14.07-.16-20.55-1.58Z"
          className="cls-18"
        />
        <path
          d="M91.6 81.73s-7.75-2.02-21.6-2.02V48.59s16.62-.53 25.51 5.93c2.25 1.72 2.61 3.08 2.25 4.21-.36 1.13-6.17 23-6.17 23ZM90.55 136.78 93 161.84s-3.48 4.9-23 4.9v-28.37s14.07-.16 20.55-1.58Z"
          className="cls-13"
        />
        <path
          d="M51.88 81.04a87.3 87.3 0 0 1 2.94-.43l-4.56-29.08c-1.8.67-3.52 1.49-5.05 2.49l6.67 27.01ZM58.22 49.48c-1.72.29-3.51.67-5.26 1.17l3.29 29.79c.8-.09 1.66-.18 2.57-.26l-.6-30.7ZM49.81 163.72c1.09.5 2.57 1.04 4.56 1.52l1.24-27.59c-1.12-.11-2.21-.23-3.23-.37l-2.57 26.44Z"
          className="cls-17"
        />
        <path
          d="M90.19 163.72c-1.09.5-2.57 1.04-4.56 1.52l-1.24-27.59c1.12-.11 2.21-.23 3.23-.37l2.57 26.44Z"
          className="cls-19"
        />
        <path
          d="M63.04 138.15c-1.51-.07-3.14-.16-4.78-.28l-1.06 27.95c1.67.28 3.61.52 5.85.68v-28.35Z"
          className="cls-17"
        />
        <path
          d="M47.86 115.03c.08-.92.16-1.85.25-2.83.05-.59.09-1.18.13-1.77l-7.46-.62c.05 2.19.09 4.37.14 6.53l6.94-1.31ZM40.43 90.02l7.52 4.99c-.29-3.16-.7-6.23-1.18-9.15l-6.43-5.98c.01 3.15.05 6.56.09 10.15Z"
          className="cls-19"
        />
        <path
          d="M52.69 12.02a2.49 2.49 0 0 0-1.59-.55c-1.24 0-2.25.84-2.25 1.88 0 .12.02.24.04.36 1.47-.73 2.79-1.28 3.62-1.6.06-.02.12-.06.18-.09ZM46.09 14.48c-.79 0-1.43.5-1.43 1.11 0 .18.06.35.16.5.7-.49 1.43-.94 2.16-1.36-.25-.15-.55-.25-.89-.25ZM87.31 12.02c.41-.34.97-.55 1.59-.55 1.24 0 2.25.84 2.25 1.88 0 .12-.02.24-.04.36-1.47-.73-2.79-1.28-3.62-1.6-.06-.02-.12-.06-.18-.09ZM93.91 14.48c.79 0 1.43.5 1.43 1.11a.9.9 0 0 1-.16.5c-.7-.49-1.43-.94-2.16-1.36.25-.15.55-.25.89-.25Z"
          className="cls-3"
        />
        <path
          d="M88.12 81.04a87.3 87.3 0 0 0-2.94-.43l4.56-29.08c1.8.67 3.52 1.49 5.05 2.49l-6.67 27.01Z"
          className="cls-19"
        />
      </g>
      <g id="Layer_3" data-name="Layer 3">
        <g id="rightQuarter" onClick={handleClick} className="cursor-pointer">
          <rect
            id="rightQuarter"
            width={24.85}
            height={24.85}
            x={108.61}
            y={136.02}
            fill={getColor(rightQuarter.panelStatus)}
            stroke={tag === "rightQuarter" ? "#175cd3" : "#aeaeae"}
            // className={tag === "rightQuarter" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "rightQuarter" ? "cls-91" : "cls-9"}
            x={108.61 + 24.85 / 2}
            y={136.02 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(rightQuarter) > 0 && dentsCount(rightQuarter)}
          </text>
        </g>
        <g id="leftQuarter" onClick={handleClick} className="cursor-pointer">
          <rect
            id="leftQuarter"
            width={24.85}
            height={24.85}
            x={6.23}
            y={136.02}
            fill={getColor(leftQuarter.panelStatus)}
            stroke={tag === "leftQuarter" ? "#175cd3" : "#aeaeae"}
            // className={tag === "leftQuarter" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "leftQuarter" ? "cls-91" : "cls-9"}
            x={6.23 + 24.85 / 2}
            y={136.02 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(leftQuarter) > 0 && dentsCount(leftQuarter)}
          </text>
        </g>
        <g id="hood" onClick={handleClick} className="cursor-pointer">
          <rect
            id="hood"
            width={24.85}
            height={24.85}
            x={57.92}
            y={3.16}
            fill={getColor(hood.panelStatus)}
            stroke={tag === "hood" ? "#175cd3" : "#aeaeae"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "hood" ? "cls-91" : "cls-9"}
            x={57.92 + 24.85 / 2}
            y={3.16 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(hood) > 0 && dentsCount(hood)}
          </text>
        </g>
        <g
          id="rightFrontFender"
          onClick={handleClick}
          className="cursor-pointer"
        >
          <rect
            id="rightFrontFender"
            width={24.85}
            height={24.85}
            x={108.61}
            y={19.29}
            fill={getColor(rightFrontFender.panelStatus)}
            stroke={tag === "rightFrontFender" ? "#175cd3" : "#aeaeae"}
            // className={tag === "rightFrontFender" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "rightFrontFender" ? "cls-91" : "cls-9"}
            x={108.61 + 24.85 / 2}
            y={19.29 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(rightFrontFender) > 0 && dentsCount(rightFrontFender)}
          </text>
        </g>
        <g id="rightFrontDoor" onClick={handleClick} className="cursor-pointer">
          <rect
            id="rightFrontDoor"
            width={24.85}
            height={24.85}
            x={108.61}
            y={56.6}
            fill={getColor(rightFrontDoor.panelStatus)}
            stroke={tag === "rightFrontDoor" ? "#175cd3" : "#aeaeae"}
            // className={tag === "rightFrontDoor" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "rightFrontDoor" ? "cls-91" : "cls-9"}
            x={108.61 + 24.85 / 2}
            y={56.6 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(rightFrontDoor) > 0 && dentsCount(rightFrontDoor)}
          </text>
        </g>
        <g id="rightRearDoor" onClick={handleClick} className="cursor-pointer">
          <rect
            id="rightRearDoor"
            width={24.85}
            height={24.85}
            x={108.61}
            y={98.73}
            fill={getColor(rightRearDoor.panelStatus)}
            stroke={tag === "rightRearDoor" ? "#175cd3" : "#aeaeae"}
            // className={tag === "rightRearDoor" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "rightRearDoor" ? "cls-91" : "cls-9"}
            x={108.61 + 24.85 / 2}
            y={98.73 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(rightRearDoor) > 0 && dentsCount(rightRearDoor)}
          </text>
        </g>
        <g id="roof" onClick={handleClick} className="cursor-pointer">
          <rect
            id="roof"
            width={24.85}
            height={24.85}
            x={57.92}
            y={82.73}
            fill={getColor(roof.panelStatus)}
            stroke={tag === "roof" ? "#175cd3" : "#aeaeae"}
            // className={tag === "roof" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "roof" ? "cls-91" : "cls-9"}
            x={57.92 + 24.85 / 2}
            y={82.73 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(roof) > 0 && dentsCount(roof)}
          </text>
        </g>
        <g id="trunkUp" onClick={handleClick} className="cursor-pointer">
          <rect
            id="trunkUp"
            width={24.85}
            height={24.85}
            x={57.92}
            y={135.73}
            fill={getColor(trunkUp.panelStatus)}
            stroke={tag === "trunkUp" ? "#175cd3" : "#aeaeae"}
            // className={tag === "trunkUp" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "trunkUp" ? "cls-91" : "cls-9"}
            x={57.92 + 24.85 / 2}
            y={135.73 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(trunkUp) > 0 && dentsCount(trunkUp)}
          </text>
        </g>
        <g id="trunkDown" onClick={handleClick} className="cursor-pointer">
          <rect
            id="trunkDown"
            width={24.85}
            height={24.85}
            x={57.92}
            y={163.21}
            fill={getColor(trunkDown.panelStatus)}
            stroke={tag === "trunkDown" ? "#175cd3" : "#aeaeae"}
            // className={tag === "trunkDown" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "trunkDown" ? "cls-91" : "cls-9"}
            x={57.92 + 24.85 / 2}
            y={163.21 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(trunkDown) > 0 && dentsCount(trunkDown)}
          </text>
        </g>
        <g id="leftRearDoor" onClick={handleClick} className="cursor-pointer">
          <rect
            id="leftRearDoor"
            width={24.85}
            height={24.85}
            x={6.23}
            y={98.73}
            fill={getColor(leftRearDoor.panelStatus)}
            stroke={tag === "leftRearDoor" ? "#175cd3" : "#aeaeae"}
            // className={tag === "leftRearDoor" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "leftRearDoor" ? "cls-91" : "cls-9"}
            x={6.23 + 24.85 / 2}
            y={98.73 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(leftRearDoor) > 0 && dentsCount(leftRearDoor)}
          </text>
        </g>
        <g id="leftFrontDoor" onClick={handleClick} className="cursor-pointer">
          <rect
            id="leftFrontDoor"
            width={24.85}
            height={24.85}
            x={6.23}
            y={56.6}
            fill={getColor(leftFrontDoor.panelStatus)}
            stroke={tag === "leftFrontDoor" ? "#175cd3" : "#aeaeae"}
            // className={tag === "leftFrontDoor" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "leftFrontDoor" ? "cls-91" : "cls-9"}
            x={6.23 + 24.85 / 2}
            y={56.6 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(leftFrontDoor) > 0 && dentsCount(leftFrontDoor)}
          </text>
        </g>
        <g
          id="leftFrontFender"
          onClick={handleClick}
          className="cursor-pointer"
        >
          <rect
            id="leftFrontFender"
            width={24.85}
            height={24.85}
            x={6.23}
            y={19.29}
            fill={getColor(leftFrontFender.panelStatus)}
            stroke={tag === "leftFrontFender" ? "#175cd3" : "#aeaeae"}
            // className={tag === "leftFrontFender" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "leftFrontFender" ? "cls-91" : "cls-9"}
            x={6.23 + 24.85 / 2}
            y={19.29 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(leftFrontFender) > 0 && dentsCount(leftFrontFender)}
          </text>
        </g>
        <g id="leftRail" onClick={handleClick} className="cursor-pointer">
          <rect
            id="leftRail"
            width={24.85}
            height={24.85}
            x={34.37}
            y={110.6}
            fill={getColor(leftRail.panelStatus)}
            stroke={tag === "leftRail" ? "#175cd3" : "#aeaeae"}
            // className={tag === "leftRail" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "leftRail" ? "cls-91" : "cls-9"}
            x={34.37 + 24.85 / 2}
            y={110.6 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(leftRail) > 0 && dentsCount(leftRail)}
          </text>
        </g>
        <g id="rightRail" onClick={handleClick} className="cursor-pointer">
          <rect
            id="rightRail"
            width={24.85}
            height={24.85}
            x={81.47}
            y={110.6}
            fill={getColor(rightRail.panelStatus)}
            stroke={tag === "rightRail" ? "#175cd3" : "#aeaeae"}
            // className={tag === "rightRail" ? "cls-41" : "cls-4"}
            rx={6.57}
            ry={6.57}
          />
          <text
            className={tag === "rightRail" ? "cls-91" : "cls-9"}
            // className={tag === "rightRail" ? "cls-91" : "cls-9"}
            // transform="translate(89.94 125.4)"
            x={81.47 + 24.85 / 2}
            y={110.6 + 24.85 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {dentsCount(rightRail) > 0 && dentsCount(rightRail)}
          </text>
        </g>
      </g>
    </svg>
  );
};
export default SvgComponent;
