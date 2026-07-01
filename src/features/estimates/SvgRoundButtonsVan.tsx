import { useFormContext } from "react-hook-form";
import type { Panel } from "./types/types";

type SvgProps = {
  tag: string | undefined;
  onPathClick: (pathId: string) => void;
};

function SvgRoundButtonsVan({ tag, onPathClick }: SvgProps) {
  const { watch } = useFormContext();
  const panels = watch("estimateHailPanel") as Panel[];

  const hood = panels.find((panel) => panel.panel === "hood");
  const leftFrontFender = panels.find(
    (panel) => panel.panel === "leftFrontFender",
  );
  const leftFrontDoor = panels.find((panel) => panel.panel === "leftFrontDoor");
  const leftRocker = panels.find((panel) => panel.panel === "leftRocker");
  // const leftRearDoor = panels.find((panel) => panel.panel === "leftRearDoor");
  const leftQuarter = panels.find((panel) => panel.panel === "leftQuarter");
  const rightFrontFender = panels.find(
    (panel) => panel.panel === "rightFrontFender",
  );
  const rightFrontDoor = panels.find(
    (panel) => panel.panel === "rightFrontDoor",
  );
  const rightRocker = panels.find((panel) => panel.panel === "rightRocker");
  const rightRearDoor = panels.find((panel) => panel.panel === "rightRearDoor");
  const rightQuarter = panels.find((panel) => panel.panel === "rightQuarter");
  const roof = panels.find((panel) => panel.panel === "roof");
  const leftRail = panels.find((panel) => panel.panel === "leftRail");
  const rightRail = panels.find((panel) => panel.panel === "rightRail");
  const trunk = panels.find((panel) => panel.panel === "trunk");
  // const windScreenFrame = panels.find(
  //   (panel) => panel.panel === "windScreenFrame",
  // );
  const cowl = panels.find((panel) => panel.panel === "cowl");

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
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 580"
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
      <rect
        id="background"
        style={{
          fill: "none",
        }}
        x={0.5}
        y={-0.5}
        width={419}
        height={560}
      />
      {/* <g id="windScreenFrame" onClick={handleClick} className="cursor-pointer">
        <circle
          id="windScreenFrame"
          data-name="windScreenFrame"
          cx={115.26}
          cy={282.41}
          r={20}
          fill={getColor(windScreenFrame.panelStatus)}
          stroke={tag === "windScreenFrame" ? "#175cd3" : "#aeaeae"}
        />
        <text
          className={tag === "windScreenFrame" ? "cls-2" : "cls-3"}
          x={115.26}
          y={284}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(windScreenFrame) > 0 && dentsCount(windScreenFrame)}
        </text>
        <g
          className={
            windScreenFrame.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <circle
            id="techDents"
            className="cls-4"
            cx={148.46}
            cy={266.41}
            r={15}
          />
          <text
            className="cls-22"
            x={148.46}
            y={267}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {windScreenFrame.technicalDentsCount > 0 &&
              windScreenFrame.technicalDentsCount}
          </text>
        </g>
        <g className={windScreenFrame.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium"
            className="cls-6"
            fill="red"
            cx={148.46}
            cy={298.41}
            r={15}
          />
          <text
            className="cls-2"
            x={148.46}
            y={299}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g> */}
      <g id="trunk" onClick={handleClick} className="cursor-pointer">
        <circle
          id="trunk"
          data-name="trunk"
          fill={getColor(trunk.panelStatus)}
          stroke={tag === "trunk" ? "#175cd3" : "#aeaeae"}
          cx={33.39}
          cy={282.41}
          r={20}
        />
        <text
          className={tag === "trunk" ? "cls-2" : "cls-3"}
          x={33.39}
          y={284.41}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(trunk) > 0 && dentsCount(trunk)}
        </text>
        <g className={trunk.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents"
            data-name="techDents"
            className="cls-4"
            cx={66.59}
            cy={266.41}
            r={15}
          />
          <text
            className="cls-22"
            x={66.59}
            y={268.41}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {trunk.technicalDentsCount > 0 && trunk.technicalDentsCount}
          </text>
        </g>
        <g className={trunk.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium"
            data-name="aluminium"
            className="cls-6"
            cx={66.59}
            cy={298.41}
            r={15}
          />
          <text
            className="cls-2"
            x={66.59}
            y={301}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="roof" onClick={handleClick} className="cursor-pointer">
        <circle
          id="roof-2"
          data-name="roof"
          fill={getColor(roof.panelStatus)}
          stroke={tag === "roof" ? "#175cd3" : "#aeaeae"}
          cx={203.13}
          cy={282.41}
          r={20}
        />
        <text
          className={tag === "roof" ? "cls-2" : "cls-3"}
          x={203.13}
          y={283.41}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(roof) > 0 && dentsCount(roof)}
        </text>
        <g className={roof.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents"
            data-name="techDents"
            className="cls-1"
            cx={236.33}
            cy={266.41}
            r={15}
          />
          <text
            className="cls-22"
            x={236.33}
            y={267}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {roof.technicalDentsCount > 0 && roof.technicalDentsCount}
          </text>
        </g>
        <g className={roof.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium"
            data-name="aluminium"
            className={roof.isAluminium ? "cls-6" : "cls-5"}
            cx={236.33}
            cy={298.41}
            r={15}
          />
          <text
            className="cls-2"
            x={236.33}
            y={299}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="hood" onClick={handleClick} className="cursor-pointer">
        <circle
          id="hood-2"
          data-name="hood"
          fill={getColor(hood.panelStatus)}
          stroke={tag === "hood" ? "#175cd3" : "#aeaeae"}
          cx={368.88}
          cy={282.41}
          r={20}
        />
        <text
          className={tag === "hood" ? "cls-2" : "cls-3"}
          x={368.88}
          y={284.41}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(hood) > 0 && dentsCount(hood)}
        </text>
        <g className={hood.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-4"
            data-name="techDents"
            className="cls-4"
            cx={402.08}
            cy={266.41}
            r={15}
          />
          <text
            className="cls-22"
            x={402.08}
            y={268.41}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {hood.technicalDentsCount > 0 && hood.technicalDentsCount}
          </text>
        </g>
        <g className={hood.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-4"
            data-name="aluminium"
            className="cls-6"
            cx={402.08}
            cy={298.41}
            r={15}
          />
          <text
            className="cls-2"
            x={402.08}
            y={300}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="cowl" onClick={handleClick} className="cursor-pointer">
        <circle
          id="cowl-2"
          data-name="cowl"
          fill={getColor(cowl.panelStatus)}
          stroke={tag === "cowl" ? "#175cd3" : "#aeaeae"}
          cx={296.01}
          cy={282.41}
          r={20}
        />
        <text
          className={tag === "cowl" ? "cls-2" : "cls-3"}
          x={296.01}
          y={284}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(cowl) > 0 && dentsCount(cowl)}
        </text>
        <g className={cowl.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-5"
            data-name="techDents"
            className="cls-4"
            cx={329.21}
            cy={266.41}
            r={15}
          />
          <text
            className="cls-22"
            x={329.21}
            y={267}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {cowl.technicalDentsCount > 0 && cowl.technicalDentsCount}
          </text>
        </g>
        <g className={cowl.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-5"
            data-name="aluminium"
            className="cls-6"
            cx={329.21}
            cy={298.41}
            r={15}
          />
          <text
            className="cls-2"
            x={329.21}
            y={299}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightFrontFender" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightFrontFender-2"
          data-name="rightFrontFender"
          fill={getColor(rightFrontFender.panelStatus)}
          stroke={tag === "rightFrontFender" ? "#175cd3" : "#aeaeae"}
          cx={336}
          cy={455.5}
          r={20}
        />
        <text
          className={tag === "rightFrontFender" ? "cls-2" : "cls-3"}
          x={336}
          y={457}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightFrontFender) > 0 && dentsCount(rightFrontFender)}
        </text>
        <g
          className={
            rightFrontFender.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <circle
            id="techDents-6"
            data-name="techDents"
            className="cls-4"
            cx={369.2}
            cy={439.5}
            r={15}
          />
          <text
            className="cls-22"
            x={369.2}
            y={440}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightFrontFender.technicalDentsCount > 0 &&
              rightFrontFender.technicalDentsCount}
          </text>
        </g>
        <g className={rightFrontFender.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-6"
            data-name="aluminium"
            className="cls-6"
            cx={369.2}
            cy={471.5}
            r={15}
          />
          <text
            className="cls-2"
            x={369}
            y={472}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightFrontDoor" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightFrontDoor-2"
          data-name="rightFrontDoor"
          fill={getColor(rightFrontDoor.panelStatus)}
          stroke={tag === "rightFrontDoor" ? "#175cd3" : "#aeaeae"}
          cx={252.51}
          cy={450.5}
          r={20}
        />
        <text
          className={tag === "rightFrontDoor" ? "cls-2" : "cls-3"}
          x={252}
          y={452}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightFrontDoor) > 0 && dentsCount(rightFrontDoor)}
        </text>
        <g
          className={rightFrontDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <circle
            id="techDents-7"
            data-name="techDents"
            className="cls-4"
            cx={285.7}
            cy={434.5}
            r={15}
          />
          <text
            className="cls-22"
            x={285.7}
            y={436}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightFrontDoor.technicalDentsCount > 0 &&
              rightFrontDoor.technicalDentsCount}
          </text>
        </g>
        <g className={rightFrontDoor.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-7"
            data-name="aluminium"
            className="cls-6"
            cx={285.7}
            cy={466.5}
            r={15}
          />
          <text
            className="cls-2"
            x={285.7}
            y={467}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightRocker" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightRocker-2"
          data-name="rightRocker"
          fill={getColor(rightRocker.panelStatus)}
          stroke={tag === "rightRocker" ? "#175cd3" : "#aeaeae"}
          cx={205.26}
          cy={503.5}
          r={20}
        />
        <text
          className={tag === "rightRocker" ? "cls-2" : "cls-3"}
          x={205.26}
          y={505}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRocker) > 0 && dentsCount(rightRocker)}
        </text>
        <g className={rightRocker.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-8"
            data-name="techDents"
            className="cls-4"
            cx={238.46}
            cy={487.5}
            r={15}
          />
          <text
            className="cls-22"
            x={238.46}
            y={488}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRocker.technicalDentsCount > 0 &&
              rightRocker.technicalDentsCount}
          </text>
        </g>
        <g className={rightRocker.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-8"
            data-name="aluminium"
            className="cls-6"
            cx={238.46}
            cy={519.5}
            r={15}
          />
          <text
            className="cls-2"
            x={238.46}
            y={520}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightRearDoor" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightRearDoor-2"
          data-name="rightRearDoor"
          fill={getColor(rightRearDoor.panelStatus)}
          stroke={tag === "rightRearDoor" ? "#175cd3" : "#aeaeae"}
          cx={164.01}
          cy={450.5}
          r={20}
        />
        <text
          className={tag === "rightRearDoor" ? "cls-2" : "cls-3"}
          x={164.01}
          y={451}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRearDoor) > 0 && dentsCount(rightRearDoor)}
        </text>
        <g
          className={rightRearDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <circle
            id="techDents-9"
            data-name="techDents"
            className="cls-4"
            cx={197.21}
            cy={434.5}
            r={15}
          />
          <text
            className="cls-22"
            x={197.21}
            y={436}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRearDoor.technicalDentsCount > 0 &&
              rightRearDoor.technicalDentsCount}
          </text>
        </g>
        <g className={rightRearDoor.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-9"
            data-name="aluminium"
            className="cls-6"
            cx={197.21}
            cy={466.5}
            r={15}
          />
          <text
            className="cls-2"
            x={197.21}
            y={467}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightQuarter" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightQuarter-2"
          data-name="rightQuarter"
          fill={getColor(rightQuarter.panelStatus)}
          stroke={tag === "rightQuarter" ? "#175cd3" : "#aeaeae"}
          cx={70.51}
          cy={445.5}
          r={20}
        />
        <text
          className={tag === "rightQuarter" ? "cls-2" : "cls-3"}
          x={70.51}
          y={447.5}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightQuarter) > 0 && dentsCount(rightQuarter)}
        </text>
        <g className={rightQuarter.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-10"
            data-name="techDents"
            className="cls-4"
            cx={103.71}
            cy={429.5}
            r={15}
          />
          <text
            className="cls-22"
            x={103.71}
            y={431}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightQuarter.technicalDentsCount > 0 &&
              rightQuarter.technicalDentsCount}
          </text>
        </g>
        <g className={rightQuarter.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-10"
            data-name="aluminium"
            className="cls-6"
            cx={103.71}
            cy={461.5}
            r={15}
          />
          <text
            className="cls-2"
            x={103.71}
            y={463}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="leftFrontFender" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftFrontFender-2"
          data-name="leftFrontFender"
          fill={getColor(leftFrontFender.panelStatus)}
          stroke={tag === "leftFrontFender" ? "#175cd3" : "#aeaeae"}
          cx={336}
          cy={99.09}
          r={20}
        />
        <text
          className={tag === "leftFrontFender" ? "cls-2" : "cls-3"}
          x={336}
          y={100.09}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftFrontFender) > 0 && dentsCount(leftFrontFender)}
        </text>
        <g
          className={
            leftFrontFender.technicalDentsCount > 0 ? "cls-7" : "cls-5"
          }
        >
          <circle
            id="techDents-11"
            data-name="techDents"
            className="cls-4"
            cx={369.2}
            cy={83.09}
            r={15}
          />
          <text
            className="cls-22"
            x={369.2}
            y={85}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftFrontFender.technicalDentsCount > 0 &&
              leftFrontFender.technicalDentsCount}
          </text>
        </g>
        <g className={leftFrontFender.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-11"
            data-name="aluminium"
            className="cls-6"
            cx={369.2}
            cy={115.09}
            r={15}
          />
          <text
            className="cls-2"
            x={369.2}
            y={117}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="leftFrontDoor" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftFrontDoor-2"
          data-name="leftFrontDoor"
          fill={getColor(leftFrontDoor.panelStatus)}
          stroke={tag === "leftFrontDoor" ? "#175cd3" : "#aeaeae"}
          cx={249.51}
          cy={109.09}
          r={20}
        />
        <text
          className={tag === "leftFrontDoor" ? "cls-2" : "cls-3"}
          x={249.51}
          y={111}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftFrontDoor) > 0 && dentsCount(leftFrontDoor)}
        </text>
        <g
          className={leftFrontDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}
        >
          <circle
            id="techDents-12"
            data-name="techDents"
            className="cls-4"
            cx={282.7}
            cy={93.09}
            r={15}
          />
          <text
            className="cls-22"
            x={282.7}
            y={95}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftFrontDoor.technicalDentsCount > 0 &&
              leftFrontDoor.technicalDentsCount}
          </text>
        </g>
        <g className={leftFrontDoor.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-12"
            data-name="aluminium"
            className="cls-6"
            cx={282.7}
            cy={125.09}
            r={15}
          />
          <text
            className="cls-2"
            x={282.7}
            y={127}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="leftRocker" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftRocker-2"
          data-name="leftRocker"
          fill={getColor(leftRocker.panelStatus)}
          stroke={tag === "leftRocker" ? "#175cd3" : "#aeaeae"}
          cx={206.26}
          cy={53.72}
          r={20}
        />
        <text
          className={tag === "leftRocker" ? "cls-2" : "cls-3"}
          x={206.26}
          y={55}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRocker) > 0 && dentsCount(leftRocker)}
        </text>
        <g className={leftRocker.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-13"
            data-name="techDents"
            className="cls-4"
            cx={239.46}
            cy={37.72}
            r={15}
          />
          <text
            className="cls-22"
            x={239.46}
            y={39.72}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRocker.technicalDentsCount > 0 &&
              leftRocker.technicalDentsCount}
          </text>
        </g>
        <g className={leftRocker.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-13"
            data-name="aluminium"
            className="cls-6"
            cx={239.46}
            cy={69.72}
            r={15}
          />
          <text
            className="cls-2"
            x={239.46}
            y={71.72}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      {/* <g id="leftRearDoor" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftRearDoor-2"
          data-name="leftRearDoor"
          fill={getColor(leftRearDoor.panelStatus)}
          stroke={tag === "leftRearDoor" ? "#175cd3" : "#aeaeae"}
          cx={156.01}
          cy={109.09}
          r={20}
        />
        <text
          className={tag === "leftRearDoor" ? "cls-2" : "cls-3"}
          x={156.01}
          y={111.09}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRearDoor) > 0 && dentsCount(leftRearDoor)}
        </text>
        <g className={leftRearDoor.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-14"
            data-name="techDents"
            className="cls-4"
            cx={189.21}
            cy={93.09}
            r={15}
          />
          <text
            className="cls-22"
            x={189.21}
            y={95.09}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRearDoor.technicalDentsCount > 0 &&
              leftRearDoor.technicalDentsCount}
          </text>
        </g>
        <g className={leftRearDoor.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-14"
            data-name="aluminium"
            className="cls-6"
            cx={189.21}
            cy={125.09}
            r={15}
          />
          <text
            className="cls-2"
            x={189.21}
            y={127.09}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g> */}
      <g id="leftQuarter" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftQuarter-2"
          data-name="leftRearQuarter"
          fill={getColor(leftQuarter.panelStatus)}
          stroke={tag === "leftQuarter" ? "#175cd3" : "#aeaeae"}
          cx={70.51}
          cy={109.09}
          r={20}
        />
        <text
          className={tag === "leftQuarter" ? "cls-2" : "cls-3"}
          x={70.51}
          y={111.09}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftQuarter) > 0 && dentsCount(leftQuarter)}
        </text>
        <g className={leftQuarter.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-15"
            data-name="techDents"
            className="cls-4"
            cx={103.71}
            cy={93.09}
            r={15}
          />
          <text
            className="cls-22"
            x={103.71}
            y={95.09}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftQuarter.technicalDentsCount > 0 &&
              leftQuarter.technicalDentsCount}
          </text>
        </g>
        <g className={leftQuarter.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-15"
            data-name="aluminium"
            className="cls-6"
            cx={103.71}
            cy={125.09}
            r={15}
          />
          <text
            className="cls-2"
            x={103.71}
            y={127.09}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="rightRail" onClick={handleClick} className="cursor-pointer">
        <circle
          id="rightRail-2"
          data-name="rightRail"
          fill={getColor(rightRail.panelStatus)}
          stroke={tag === "rightRail" ? "#175cd3" : "#aeaeae"}
          cx={130.88}
          cy={336.6}
          r={20}
        />
        <text
          className={tag === "rightRail" ? "cls-2" : "cls-3"}
          x={130.88}
          y={338.6}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(rightRail) > 0 && dentsCount(rightRail)}
        </text>
        <g className={rightRail.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-16"
            data-name="techDents"
            className="cls-4"
            cx={164.08}
            cy={320.6}
            r={15}
          />
          <text
            className="cls-22"
            x={164.08}
            y={322.6}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {rightRail.technicalDentsCount > 0 && rightRail.technicalDentsCount}
          </text>
        </g>
        <g className={rightRail.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-16"
            data-name="aluminium"
            className="cls-6"
            cx={164.08}
            cy={352.6}
            r={15}
          />
          <text
            className="cls-2"
            x={164.08}
            y={354.6}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
      <g id="leftRail" onClick={handleClick} className="cursor-pointer">
        <circle
          id="leftRail-2"
          data-name="leftRail"
          fill={getColor(leftRail.panelStatus)}
          stroke={tag === "leftRail" ? "#175cd3" : "#aeaeae"}
          cx={130.88}
          cy={229.35}
          r={20}
        />
        <text
          className={tag === "leftRail" ? "cls-2" : "cls-3"}
          x={130.88}
          y={231.35}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dentsCount(leftRail) > 0 && dentsCount(leftRail)}
        </text>
        <g className={leftRail.technicalDentsCount > 0 ? "cls-7" : "cls-5"}>
          <circle
            id="techDents-17"
            data-name="techDents"
            className="cls-4"
            cx={164.08}
            cy={213.35}
            r={15}
          />
          <text
            className="cls-22"
            x={164.08}
            y={215.35}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {leftRail.technicalDentsCount > 0 && leftRail.technicalDentsCount}
          </text>
        </g>
        <g className={leftRail.isAluminium ? "cls-7" : "cls-5"}>
          <circle
            id="aluminium-17"
            data-name="aluminium"
            className="cls-6"
            cx={164.08}
            cy={245.35}
            r={15}
          />
          <text
            className="cls-2"
            x={164.08}
            y={247.35}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            Al
          </text>
        </g>
      </g>
    </svg>
  );
}
export default SvgRoundButtonsVan;
