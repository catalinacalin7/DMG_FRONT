import { useFormContext } from "react-hook-form";
import { Panel } from "./HailEstimateManualForm";

type SvgProps = {
  tag: string | undefined;
  onPathClick: (pathId: string) => void;
};

const SvgButtons = ({ tag, onPathClick }: SvgProps) => {
  const { watch } = useFormContext();
  const hood = watch(`estimateHailPanel[0]`);
  const leftFrontFender = watch(`estimateHailPanel[1]`);
  const leftFrontDoor = watch(`estimateHailPanel[2]`);
  const leftRocker = watch(`estimateHailPanel[3]`);
  const leftRearDoor = watch(`estimateHailPanel[4]`);
  const leftQuarter = watch(`estimateHailPanel[5]`);
  const rightFrontFender = watch(`estimateHailPanel[6]`);
  const rightFrontDoor = watch(`estimateHailPanel[7]`);
  const rightRocker = watch(`estimateHailPanel[8]`);
  const rightRearDoor = watch(`estimateHailPanel[9]`);
  const rightQuarter = watch(`estimateHailPanel[10]`);
  const roof = watch(`estimateHailPanel[11]`);
  const leftRail = watch(`estimateHailPanel[12]`);
  const rightRail = watch(`estimateHailPanel[13]`);
  const trunk = watch(`estimateHailPanel[14]`);
  const windScreenFrame = watch(`estimateHailPanel[15]`);
  const cowl = watch(`estimateHailPanel[16]`);

  const dentsCount = function (item: Panel) {
    return Number(item.light) + Number(item.medium) + Number(item.strong);
  };

  const getColor = (panel: string) =>
    panel === "pdr"
      ? "#22c55e"
      : panel === "repairAndPaint"
        ? "#fb923c"
        : panel === "change"
          ? "#38BDF8"
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
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 420 560"
      width={420}
      height={560}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <style>
          {
            ".cls-1{fill:#fff;stroke:#000;stroke-miterlimit:10;stroke-width:.25px}.cls-2{font-family:MyriadPro-Regular,'Myriad Pro',Sans-Serif;font-size:16px;fill:white;font-weight:600}.cls-3{font-family:MyriadPro-Regular,'Myriad Pro',Sans-Serif;font-size:20px;fill:white;font-weight:600}.cls-4{fill: #fff;color:#000; stroke: #000;stroke-miterlimit: 10;stroke-width:.25px;}.cls-5{display: none;}.cls-6{fill: #888B8D;}.cls-22{font-family:MyriadPro-Regular,'Myriad Pro',Sans-Serif;font-size:16px;color:black;font-weight:600}.cls-7{display: block;}"
          }
        </style>
      </defs>
      <g id="rightFrontFender" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightFrontFender"
          width={60}
          height={60}
          x={340.5}
          y={85.5}
          rx={10}
          ry={10}
          fill={getColor(rightFrontFender.panelStatus)}
          stroke={tag === "rightFrontFender" ? "#175cd3" : "#aeaeae"}
        />
        <path
          id="rightFrontFenderArrow"
          d="m340.5 110.48-24.68-3.93a4.583 4.583 0 0 0-3.69-3.13c-2.57-.41-5.01 1.34-5.42 3.91a4.75 4.75 0 0 0 3.93 5.43c1.77.28 3.47-.47 4.48-1.83l25.38 4.04v-4.48Z"
          className="cls-1"
        />
        <text
          className={tag === "rightFrontFender" ? "cls-2" : "cls-3"}
          x={340.5 + 60 / 2}
          y={85.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightFrontFender) > 0 && dentsCount(rightFrontFender)}
        </text>
        <g className={rightFrontFender.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium"
            className="cls-6"
            x={385.5}
            y={82}
            width={30}
            height={30}
            rx={14}
            ry={14}
          />
          <text
            className="cls-2"
            x={385.5 + 30 / 2}
            y={82 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={
            rightFrontFender.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <rect
            id="techDents"
            className="cls-4"
            x={385.5}
            y={119}
            width={30}
            height={30}
            rx={14}
            ry={14}
          />
          <text
            className="cls-22"
            x={385.5 + 30 / 2}
            y={119 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightFrontFender.technicalDentsCount > 0 &&
              rightFrontFender.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="rightFrontDoor" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightFrontDoor"
          width={60}
          height={60}
          x={340.5}
          y={163}
          fill={getColor(rightFrontDoor.panelStatus)}
          stroke={tag === "rightFrontDoor" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="rightFrontDoorArrow"
          d="m340.5 202.14-24.66 7.19c-1.14-1.23-2.92-1.77-4.67-1.26-2.5.73-3.96 3.35-3.23 5.85a4.746 4.746 0 0 0 5.88 3.22 4.63 4.63 0 0 0 3.26-3.57l23.43-6.83v-4.61Z"
          className="cls-1"
        />
        <text
          className={tag === "rightFrontDoor" ? "cls-2" : "cls-3"}
          x={340.5 + 60 / 2}
          y={163 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightFrontDoor) > 0 && dentsCount(rightFrontDoor)}
        </text>
        <g className={rightFrontDoor.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-2"
            data-name="aluminium"
            className="cls-6"
            x={385.62}
            y={159.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={385.62 + 30 / 2}
            y={159.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={rightFrontDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <rect
            id="techDents-2"
            data-name="techDents"
            className="cls-4"
            x={385.62}
            y={196.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={385.5 + 30 / 2}
            y={196 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightFrontDoor.technicalDentsCount > 0 &&
              rightFrontDoor.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="rightRocker" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightRocker"
          width={60}
          height={60}
          x={340.5}
          y={240.5}
          fill={getColor(rightRocker.panelStatus)}
          stroke={tag === "rightRocker" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="rightRockerArrow"
          d="m340.5 275.5-21.04 5.74c-1.12-1.25-2.89-1.82-4.65-1.34-.16.04-.3.12-.45.17v8.78c.91.35 1.93.44 2.94.17a4.658 4.658 0 0 0 3.33-3.51l19.88-5.42v-4.58Z"
          className="cls-1"
        />
        <text
          className={tag === "rightRocker" ? "cls-2" : "cls-3"}
          x={340.5 + 60 / 2}
          y={240.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRocker) > 0 && dentsCount(rightRocker)}
        </text>
        <g className={rightRocker.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-3"
            data-name="aluminium"
            className="cls-6"
            x={385.5}
            y={238}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={385.5 + 30 / 2}
            y={238 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={rightRocker.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-3"
            data-name="techDents"
            className="cls-4"
            x={385.5}
            y={273}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={385.5 + 30 / 2}
            y={273 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRocker.technicalDentsCount > 0 &&
              rightRocker.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="rightRearDoor" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightRearDoor"
          width={60}
          height={60}
          x={340.5}
          y={318}
          fill={getColor(rightRearDoor.panelStatus)}
          stroke={tag === "rightRearDoor" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="rightRearDoorArrow"
          d="M340.5 350.51h-24.37c-.75-1.5-2.31-2.51-4.13-2.51-2.6 0-4.74 2.11-4.74 4.71s2.14 4.74 4.74 4.74c1.79 0 3.35-1.01 4.13-2.51h24.37v-4.42Z"
          className="cls-1"
        />
        <text
          className={tag === "rightRearDoor" ? "cls-2" : "cls-3"}
          x={340.5 + 60 / 2}
          y={318 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRearDoor) > 0 && dentsCount(rightRearDoor)}
        </text>
        <g className={rightRearDoor.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-4"
            data-name="aluminium"
            className="cls-6"
            x={385.5}
            y={315.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={385.5 + 30 / 2}
            y={315.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={rightRearDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <rect
            id="techDents-4"
            data-name="techDents"
            className="cls-4"
            x={385.5}
            y={350.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={385.5 + 30 / 2}
            y={350.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRearDoor.technicalDentsCount > 0 &&
              rightRearDoor.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="rightQuarter" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightQuarter"
          width={60}
          height={60}
          x={340.5}
          y={395.5}
          fill={getColor(rightQuarter.panelStatus)}
          stroke={tag === "rightQuarter" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="rightQuarterArrow"
          d="m340.5 429.45-35.49 11.1c-1.17-1.21-2.96-1.71-4.69-1.17-2.48.78-3.89 3.43-3.12 5.91a4.74 4.74 0 0 0 5.94 3.11c1.71-.53 2.9-1.97 3.19-3.63l34.17-10.69v-4.63Z"
          className="cls-1"
        />
        <text
          className={tag === "rightQuarter" ? "cls-2" : "cls-3"}
          x={340.5 + 60 / 2}
          y={395.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightQuarter) > 0 && dentsCount(rightQuarter)}
        </text>
        <g className={rightQuarter.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-6"
            data-name="aluminium"
            className="cls-6"
            x={385.5}
            y={393}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={385.5 + 30 / 2}
            y={393 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={rightQuarter.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-6"
            data-name="techDents"
            className="cls-4"
            x={385.5}
            y={428}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={385.5 + 30 / 2}
            y={428 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightQuarter.technicalDentsCount > 0 &&
              rightQuarter.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftQuarter" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftQuarter"
          width={60}
          height={60}
          x={19.5}
          y={395.5}
          fill={getColor(leftQuarter.panelStatus)}
          stroke={tag === "leftQuarter" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="leftQuarterArrow"
          d="M119.69 439.39c-1.74-.54-3.53-.04-4.69 1.17l-35.49-11.1v4.63l34.17 10.69c.3 1.67 1.48 3.1 3.19 3.63 2.48.78 5.15-.6 5.94-3.11.78-2.48-.63-5.13-3.12-5.91Z"
          className="cls-1"
        />
        <text
          className={tag === "leftQuarter" ? "cls-2" : "cls-3"}
          x={19.5 + 60 / 2}
          y={395.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftQuarter) > 0 && dentsCount(leftQuarter)}
        </text>
        <g className={leftQuarter.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-10"
            data-name="aluminium"
            className="cls-6"
            x={4.5}
            y={393}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={4.5 + 30 / 2}
            y={393 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={leftQuarter.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-10"
            data-name="techDents"
            className="cls-4"
            x={4.5}
            y={428}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={4.5 + 30 / 2}
            y={428 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftQuarter.technicalDentsCount > 0 &&
              leftQuarter.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftRearDoor" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftRearDoor"
          width={60}
          height={60}
          x={19.5}
          y={318}
          fill={getColor(leftRearDoor.panelStatus)}
          stroke={tag === "leftRearDoor" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="leftRearDoorArrow"
          d="M112 348c-1.82 0-3.38 1.01-4.13 2.51H79.51v4.42h28.36c.78 1.5 2.34 2.51 4.13 2.51 2.6 0 4.74-2.11 4.74-4.74s-2.14-4.71-4.74-4.71Z"
          className="cls-1"
        />
        <text
          className={tag === "leftRearDoor" ? "cls-2" : "cls-3"}
          x={19.5 + 60 / 2}
          y={318 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRearDoor) > 0 && dentsCount(leftRearDoor)}
        </text>
        <g className={leftRearDoor.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-11"
            data-name="aluminium"
            className="cls-6"
            x={4.5}
            y={315.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={4.5 + 30 / 2}
            y={315.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={leftRearDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-11"
            data-name="techDents"
            className="cls-4"
            x={4.5}
            y={350.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={4.5 + 30 / 2}
            y={350.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRearDoor.technicalDentsCount > 0 &&
              leftRearDoor.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftRocker" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftRocker"
          width={60}
          height={60}
          x={19.5}
          y={240.5}
          fill={getColor(leftRocker.panelStatus)}
          stroke={tag === "leftRocker" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="leftRockerArrow"
          d="M109.7 280.08c-.15-.06-.29-.13-.45-.17-1.76-.48-3.53.09-4.65 1.34l-25.1-6.84v4.58l23.93 6.53c.36 1.66 1.6 3.04 3.33 3.51 1.01.28 2.03.19 2.95-.17v-8.78Z"
          className="cls-1"
        />
        <text
          className={tag === "leftRocker" ? "cls-2" : "cls-3"}
          x={19.5 + 60 / 2}
          y={240.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRocker) > 0 && dentsCount(leftRocker)}
        </text>
        <g className={leftRocker.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-12"
            data-name="aluminium"
            className={leftRocker.isAluminium ? "cls-6" : "cls-5"}
            x={4.5}
            y={238}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={4.5 + 30 / 2}
            y={238 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={leftRocker.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-12"
            data-name="techDents"
            className="cls-4"
            x={4.5}
            y={273}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={4.5 + 30 / 2}
            y={273 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRocker.technicalDentsCount > 0 &&
              leftRocker.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftFrontDoor" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftFrontDoor"
          width={60}
          height={60}
          x={19.5}
          y={163}
          fill={getColor(leftFrontDoor.panelStatus)}
          stroke={tag === "leftFrontDoor" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="leftFrontDoorArrow"
          d="M111.83 208.07c-1.75-.51-3.53.02-4.67 1.26l-27.66-8.07v4.61l26.43 7.71a4.646 4.646 0 0 0 3.26 3.57c2.5.73 5.14-.7 5.88-3.22.73-2.5-.73-5.12-3.23-5.85Z"
          className="cls-1"
        />
        <text
          className={tag === "leftFrontDoor" ? "cls-2" : "cls-3"}
          x={19.5 + 60 / 2}
          y={163 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftFrontDoor) > 0 && dentsCount(leftFrontDoor)}
        </text>
        <g className={leftFrontDoor.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-14"
            data-name="aluminium"
            className="cls-6"
            x={4.5}
            y={160.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={4.5 + 30 / 2}
            y={160.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={leftFrontDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <rect
            id="techDents-14"
            data-name="techDents"
            className="cls-4"
            x={4.5}
            y={195.5}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={4.5 + 30 / 2}
            y={195.5 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftFrontDoor.technicalDentsCount > 0 &&
              leftFrontDoor.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftFrontFender" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftFrontFender"
          width={60}
          height={60}
          x={19.5}
          y={85.5}
          fill={getColor(leftFrontFender.panelStatus)}
          stroke={tag === "leftFrontFender" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <path
          id="leftFrontFenderArrow"
          d="M116.29 107.32c-.41-2.57-2.85-4.32-5.42-3.91-1.8.29-3.18 1.53-3.69 3.13l-27.68 4.41v4.48l28.38-4.52a4.661 4.661 0 0 0 4.48 1.83 4.736 4.736 0 0 0 3.93-5.43Z"
          className="cls-1"
        />
        <text
          className={tag === "leftFrontFender" ? "cls-2" : "cls-3"}
          x={19.5 + 60 / 2}
          y={85.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftFrontFender) > 0 && dentsCount(leftFrontFender)}
        </text>
        <g className={leftFrontFender.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-17"
            data-name="aluminium"
            className="cls-6"
            x={4.5}
            y={83}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={4.5 + 30 / 2}
            y={83 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={
            leftFrontFender.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <rect
            id="techDents-17"
            data-name="techDents"
            className="cls-4"
            x={4.5}
            y={118}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={4.5 + 30 / 2}
            y={118 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftFrontFender.technicalDentsCount > 0 &&
              leftFrontFender.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="leftRail" onClick={handleClick} className="cursor-pointer">
        <rect
          id="leftRail"
          width={60}
          height={60}
          x={125}
          y={303.5}
          fill={getColor(leftRail.panelStatus)}
          stroke={tag === "leftRail" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "leftRail" ? "cls-2" : "cls-3"}
          x={125 + 60 / 2}
          y={303.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRail) > 0 && dentsCount(leftRail)}
        </text>
        <g className={leftRail.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-9"
            data-name="aluminium"
            className="cls-6"
            x={170}
            y={301}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={170 + 30 / 2}
            y={301 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={leftRail.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-9"
            data-name="techDents"
            className="cls-4"
            x={170}
            y={336}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={170 + 30 / 2}
            y={336 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRail.technicalDentsCount > 0 && leftRail.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="rightRail" onClick={handleClick} className="cursor-pointer">
        <rect
          id="rightRail"
          width={60}
          height={60}
          x={235}
          y={303.5}
          fill={getColor(rightRail.panelStatus)}
          stroke={tag === "rightRail" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "rightRail" ? "cls-2" : "cls-3"}
          x={235 + 60 / 2}
          y={303.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRail) > 0 && dentsCount(rightRail)}
        </text>
        <g className={rightRail.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-8"
            data-name="aluminium"
            className="cls-6"
            x={280}
            y={301}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={280 + 30 / 2}
            y={301 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={rightRail.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-8"
            data-name="techDents"
            className="cls-4"
            x={280}
            y={336}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={280 + 30 / 2}
            y={336 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRail.technicalDentsCount > 0 && rightRail.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="windScreenFrame" onClick={handleClick} className="cursor-pointer">
        <rect
          id="windScreenFrame"
          width={60}
          height={60}
          x={180}
          y={382.5}
          fill={getColor(windScreenFrame.panelStatus)}
          stroke={tag === "windScreenFrame" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "windScreenFrame" ? "cls-2" : "cls-3"}
          x={180 + 60 / 2}
          y={382.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(windScreenFrame) > 0 && dentsCount(windScreenFrame)}
        </text>
        <g className={windScreenFrame.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-5"
            data-name="aluminium"
            className="cls-6"
            x={225}
            y={380}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={225 + 30 / 2}
            y={380 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g
          className={
            windScreenFrame.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <rect
            id="techDents-5"
            data-name="techDents"
            className="cls-4"
            x={225}
            y={415}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={225 + 30 / 2}
            y={415 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {windScreenFrame.technicalDentsCount > 0 &&
              windScreenFrame.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="trunk" onClick={handleClick} className="cursor-pointer">
        <rect
          id="trunk"
          width={60}
          height={60}
          x={180}
          y={481.5}
          fill={getColor(trunk.panelStatus)}
          stroke={tag === "trunk" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "trunk" ? "cls-2" : "cls-3"}
          x={180 + 60 / 2}
          y={481.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(trunk) > 0 && dentsCount(trunk)}
        </text>
        <g className={trunk.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-7"
            data-name="aluminium"
            className="cls-6"
            x={225}
            y={479}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={225 + 30 / 2}
            y={479 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={trunk.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-7"
            data-name="techDents"
            className="cls-4"
            x={225}
            y={514}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={225 + 30 / 2}
            y={514 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {trunk.technicalDentsCount > 0 && trunk.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="roof" onClick={handleClick} className="cursor-pointer">
        <rect
          id="roof"
          width={60}
          height={60}
          x={180}
          y={224.34}
          fill={getColor(roof.panelStatus)}
          stroke={tag === "roof" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "roof" ? "cls-2" : "cls-3"}
          x={180 + 60 / 2}
          y={224.34 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(roof) > 0 && dentsCount(roof)}
        </text>
        <g className={roof.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-13"
            data-name="aluminium"
            className={roof.isAluminium ? "cls-6" : "cls-5"}
            x={225}
            y={221.84}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={225 + 30 / 2}
            y={221.84 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={roof.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-13"
            data-name="techDents"
            className="cls-4"
            x={225}
            y={256.84}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={225 + 30 / 2}
            y={256.84 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {roof.technicalDentsCount > 0 && roof.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="cowl" onClick={handleClick} className="cursor-pointer">
        <rect
          id="cowl"
          width={60}
          height={60}
          x={180}
          y={98.5}
          fill={getColor(cowl.panelStatus)}
          stroke={tag === "cowl" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "cowl" ? "cls-2" : "cls-3"}
          x={180 + 60 / 2}
          y={98.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(cowl) > 0 && dentsCount(cowl)}
        </text>
        <g className={cowl.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-15"
            data-name="aluminium"
            className={cowl.isAluminium ? "cls-6" : "cls-5"}
            x={225}
            y={96}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={225 + 30 / 2}
            y={96 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={cowl.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-15"
            data-name="techDents"
            className="cls-4"
            x={225}
            y={131}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={225 + 30 / 2}
            y={131 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {cowl.technicalDentsCount > 0 && cowl.technicalDentsCount}
          </text>
        </g>
      </g>
      <g id="hood" onClick={handleClick} className="cursor-pointer">
        <rect
          id="hood"
          width={60}
          height={60}
          x={180}
          y={17.5}
          fill={getColor(hood.panelStatus)}
          stroke={tag === "hood" ? "#175cd3" : "#aeaeae"}
          rx={10}
          ry={10}
        />
        <text
          className={tag === "hood" ? "cls-2" : "cls-3"}
          x={180 + 60 / 2}
          y={17.5 + 60 / 1.9}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(hood) > 0 && dentsCount(hood)}
        </text>
        <g className={hood.isAluminium ? "cls-7" : "cls-5"}>
          <rect
            id="aluminium-16"
            data-name="aluminium"
            className="cls-6"
            x={224.5}
            y={15}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-2"
            x={224.5 + 30 / 2}
            y={15 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
        <g className={hood.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <rect
            id="techDents-16"
            data-name="techDents"
            className="cls-4"
            x={225}
            y={50}
            width={30}
            height={30}
            rx={15}
            ry={15}
          />
          <text
            className="cls-22"
            x={225 + 30 / 2}
            y={50 + 30 / 1.9}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {hood.technicalDentsCount > 0 && hood.technicalDentsCount}
          </text>
        </g>
      </g>
      <path
        id="background"
        d="M.5-.5h419v560H.5z"
        style={{
          fill: "none",
        }}
      />
    </svg>
  );
};
export default SvgButtons;
