"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { EstimateHail, EstimateHailPanel } from "@/api/estimates/estimates";
import { formatISO } from "date-fns";
import { PdfLabels } from "./types/types";
import { CompanyData, CompanyPaymentData } from "@/types/company";
import { PanelSatus } from "@/api/estimates/estimates";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf" },
    { src: "/fonts/Roboto-Medium.ttf", fontWeight: "medium" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Roboto-Condensed-Bold.ttf", fontWeight: "ultrabold" },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
    fontFamily: "Roboto",
  },
});

const rowStyle = StyleSheet.create({
  section: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const estimate = StyleSheet.create({
  textRight: {
    textAlign: "right",
    fontSize: 12,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

const section2 = StyleSheet.create({
  head: {
    paddingVertical: "4px",
    width: "270px",
    paddingLeft: "20px",
    marginTop: "10px",
    fontSize: "9px",
    backgroundColor: "#e5e7eb",
    borderTopRightRadius: "8px",
    borderTopLeftRadius: "8px",
  },
  infoBlock: {
    width: "270px",
    paddingVertical: "6px",
    borderBottomRightRadius: "8px",
    borderBottomLeftRadius: "8px",
    backgroundColor: "#eff6ff",
    flexDirection: "row",
    paddingLeft: "20px",
    paddingRight: "20px",
    // justifyContent: "space-between",
    gap: "20xp",
  },
  infoData: {
    fontSize: "9px",
    // width: "170px",
  },
});

const sectionStatus = StyleSheet.create({
  sectionS: {
    flexDirection: "column",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 7,
  },
  section: {
    paddingVertical: 4,
  },
  statusCircle: {
    height: 12,
    width: 12,
    borderRadius: "100px",
  },
  pdr: {
    backgroundColor: "#22c55e",
  },
  repairAndPaint: {
    backgroundColor: "#fb923c",
  },
  noDamage: {
    backgroundColor: "#fff",
    border: "1px",
    borderColor: "gray",
  },
  hOff: {
    backgroundColor: "#99a1af",
  },
  change: {
    backgroundColor: "#74d4ff",
  },
});

const tableStyles = StyleSheet.create({
  nowrapText: {
    wrap: false,
  },
  table: {
    width: "100%",
  },
  bottomBorder: {
    borderColor: "#bcc3cf",
    borderBottomWidth: "1px",
  },
  bottomPadding: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 7,
  },
  headerCell2: {
    flex: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 7,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 7,
  },
  cell2: {
    flex: 2,
    paddingVertical: 2,
    fontSize: 7,
  },
  cell3: {
    flex: 2,
    paddingHorizontal: 8,
    fontSize: 7,
  },
  cell4: {
    flex: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: "medium",
    fontSize: 7,
  },
  header: {
    backgroundColor: "#fff",
    fontWeight: "medium",
  },
  aluminium: {
    backgroundColor: "#888B8D",
    color: "white",
  },
});

const logoStyle = StyleSheet.create({
  image: {
    height: 70,
  },
});

const carImgStyle = StyleSheet.create({
  image: {
    width: 225,
  },
});

const footer = StyleSheet.create({
  section: {
    marginTop: "auto",
    borderTop: "1px",
    borderTopColor: "#e5e7eb",
    padding: "8px",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "medium",
  },
  body: {
    fontSize: 9,
    paddingVertical: 2,
  },
});

// Create Document Component
export const EstimatePdfDocument = ({
  estimateTitle,
  labels,
  logo,
  carImg,
  estimateHail,
  panels,
  totalWhithoutAddOns,
  companyData,
  companyPayment,
}: {
  estimateTitle: string;
  labels: PdfLabels;
  logo: string;
  carImg: string;
  estimateHail: EstimateHail;
  panels: EstimateHailPanel[];
  totalWhithoutAddOns?: number;
  companyData: CompanyData;
  companyPayment?: CompanyPaymentData;
}) => {
  const estimateDate =
    estimateHail?.createdAt !== undefined
      ? formatISO(new Date(estimateHail?.createdAt), { representation: "date" })
      : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={rowStyle.section}>
          <View>
            {/* eslint-disable-next-line */}
            {logo && <Image src={logo} style={logoStyle.image} />}
          </View>
          <View style={estimate.textRight}>
            <Text>{estimateTitle}</Text>
            <Text>{estimateHail.estimateNumber}</Text>
            <Text>{estimateDate}</Text>
          </View>
        </View>
        <View style={[rowStyle.section]}>
          <View>
            <Text style={section2.head}>Vehicle</Text>
            <View style={section2.infoBlock}>
              <View style={section2.infoData}>
                <Text style={{ color: "#98a2b3" }}>{labels.make}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.model}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.vin}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.year}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.plateNo}</Text>
              </View>

              <View style={section2.infoData}>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.vehicle?.make
                    ? estimateHail?.vehicle?.make
                    : " "}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.vehicle?.model
                    ? estimateHail?.vehicle?.model
                    : " "}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.vehicle?.vinNumber
                    ? estimateHail?.vehicle?.vinNumber
                    : " "}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.vehicle?.year
                    ? estimateHail?.vehicle?.year
                    : " "}
                </Text>
                <Text>
                  {estimateHail?.registrationNumber
                    ? estimateHail?.registrationNumber
                    : " "}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={section2.head}>Client</Text>
            <View style={section2.infoBlock}>
              <View style={section2.infoData}>
                <Text style={{ color: "#98a2b3" }}>{labels.name}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.taxID}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.vatId}</Text>
                <Text style={{ color: "#98a2b3" }}>{labels.address}</Text>
                <Text style={{ color: "#eff6ff" }}> </Text>
              </View>
              <View style={section2.infoData}>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.client?.name
                    ? estimateHail?.client?.name
                    : " "}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.client?.taxID
                    ? estimateHail?.client?.taxID
                    : " "}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {estimateHail?.client?.vatID
                    ? estimateHail?.client?.vatID
                    : " "}
                </Text>
                <Text>
                  {estimateHail?.client?.address
                    ? estimateHail?.client?.address
                    : " "}
                </Text>
                <Text style={{ color: "#eff6ff" }}>{""}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <View style={{ width: "100%" }}>
            {/* eslint-disable-next-line */}
            <View>
              {carImg && (
                <Image
                  cache={false}
                  source={carImg}
                  style={[carImgStyle.image]}
                />
              )}
              <View>
                {labels.impacts}: {labels.dentsCount}
              </View>
            </View>
            {/* Panel status legend */}
            <View
              style={[
                sectionStatus.sectionRow,
                {
                  alignItems: "flex-start",
                  gap: "20px",
                },
              ]}
            >
              <View style={[sectionStatus.sectionS, sectionStatus.section]}>
                <View style={{ paddingBottom: 2 }}>
                  <Text style={{ fontSize: 9, fontWeight: "medium" }}>
                    {labels.panelStatus}
                  </Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[sectionStatus.statusCircle, sectionStatus.pdr]}
                  ></Text>
                  <Text>{labels.pdr}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[
                      sectionStatus.statusCircle,
                      sectionStatus.repairAndPaint,
                    ]}
                  ></Text>
                  <Text>{labels.repairAndPaint}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[sectionStatus.statusCircle, sectionStatus.noDamage]}
                  ></Text>
                  <Text>{labels.noDamage}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[sectionStatus.statusCircle, sectionStatus.hOff]}
                  ></Text>
                  <Text>{labels.hOff}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[sectionStatus.statusCircle, sectionStatus.change]}
                  ></Text>
                  <Text>{labels.change}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text style={{ padding: 2 }}>{labels.technicalDentsAbr}</Text>
                  <Text>{labels.technicalDents}</Text>
                </View>
              </View>
              {/* Dent size legend */}
              <View style={[sectionStatus.sectionS, sectionStatus.section]}>
                <View style={{ paddingBottom: 2 }}>
                  <Text style={{ fontSize: 9, fontWeight: "medium" }}>
                    {labels.dentSize}
                  </Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[
                      sectionStatus.statusCircle,
                      { backgroundColor: "#FF0000" },
                    ]}
                  ></Text>
                  <Text>{labels.lightDents}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[
                      sectionStatus.statusCircle,
                      { backgroundColor: "#CC0000" },
                    ]}
                  ></Text>
                  <Text>{labels.mediumDents}</Text>
                </View>
                <View style={sectionStatus.sectionRow}>
                  <Text
                    style={[
                      sectionStatus.statusCircle,
                      { backgroundColor: "#8F0000" },
                    ]}
                  ></Text>
                  <Text>{labels.strongDents}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Panels summary */}
          <View
            style={[tableStyles.column, tableStyles.table, { paddingTop: 15 }]}
          >
            <View style={tableStyles.table}>
              <View
                style={[
                  tableStyles.row,
                  tableStyles.header,
                  tableStyles.bottomBorder,
                ]}
              >
                <Text style={tableStyles.headerCell}>{labels.panel}</Text>
                <Text style={tableStyles.headerCell}>{labels.impacts}</Text>
                {/* <Text style={tableStyles.headerCell2}>{labels.comments}</Text> */}
              </View>
              {panels?.map((item, index) => {
                if (
                  item.panelStatus === PanelSatus.pdr ||
                  item.panelStatus === PanelSatus.repairAndPaint
                ) {
                  return (
                    <View
                      key={index}
                      style={[tableStyles.column, tableStyles.bottomBorder]}
                    >
                      <View style={tableStyles.row}>
                        <Text
                          style={[tableStyles.cell, tableStyles.nowrapText]}
                        >
                          {item.panel} {item.isAluminium ? "Al" : null}
                        </Text>
                        <Text style={tableStyles.cell}>
                          <Text
                            style={[
                              tableStyles.cell,
                              tableStyles.nowrapText,
                              { color: "#FF0000" },
                            ]}
                          >
                            D1:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {Number(item.light) > 0 ? item.light : "0"}
                            </Text>
                            {"  "}
                          </Text>
                          <Text
                            style={[
                              tableStyles.cell,
                              tableStyles.nowrapText,
                              { color: "#CC0000" },
                            ]}
                          >
                            D2:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {Number(item.medium) > 0 ? item.medium : "0"}
                            </Text>
                            {"  "}
                          </Text>
                          <Text
                            style={[
                              tableStyles.cell,
                              tableStyles.nowrapText,
                              { color: "#8F0000" },
                            ]}
                          >
                            D3:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                              {Number(item.strong) > 0 ? item.strong : "0"}
                            </Text>
                            {"  "}
                          </Text>
                          {item.technicalDentsCount > 0
                            ? `+ ${item.technicalDentsCount}${labels.technicalDentsAbr}`
                            : null}{" "}
                          {item.panelStatus === PanelSatus.pdr
                            ? labels.pdr
                            : labels.repairAndPaint}
                        </Text>
                        {/* <Text style={tableStyles.cell2}>
                          {item?.estimatePanelLabel.map((label) => (
                            <Text key={label.label}>{label.label} </Text>
                          ))}
                          <Text>{item.comment}</Text>
                        </Text> */}
                      </View>
                    </View>
                  );
                } else if (
                  item.panelStatus === "hOff" ||
                  item.panelStatus === "change"
                ) {
                  return (
                    <View
                      key={index}
                      style={[tableStyles.row, tableStyles.bottomBorder]}
                    >
                      <Text style={[tableStyles.cell, tableStyles.nowrapText]}>
                        {item.panel}
                      </Text>
                      <Text style={tableStyles.cell}>
                        {item.panelStatus === "change"
                          ? labels.change
                          : labels.hOff}
                      </Text>
                      <Text style={tableStyles.cell2}></Text>
                      <Text style={tableStyles.cell}></Text>
                    </View>
                  );
                } else {
                  return;
                }
              })}
            </View>

            <View
              style={[
                tableStyles.column,
                {
                  width: "50%",
                  alignSelf: "flex-end",
                },
              ]}
            >
              <View style={[tableStyles.row, tableStyles.table]}>
                <Text style={tableStyles.cell4}>PDR</Text>
                <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                  {estimateHail.currency}{" "}
                  {(
                    (Number(estimateHail?.retainedPrice) -
                      Number(estimateHail.removeInstall)) /
                    100
                  ).toFixed(2)}
                </Text>
              </View>
              <View style={[tableStyles.row, tableStyles.table]}>
                <Text style={tableStyles.cell4}>{labels.removeInstall}</Text>
                <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                  {estimateHail.currency}{" "}
                  {(Number(estimateHail.removeInstall) / 100).toFixed(2)}
                </Text>
              </View>
              <View style={[tableStyles.row, tableStyles.table]}>
                <Text style={tableStyles.cell4}>Total</Text>
                <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                  {estimateHail.currency}{" "}
                  {(Number(estimateHail?.retainedPrice) / 100).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[tableStyles.row, tableStyles.table]}>
          <View style={{ width: "560px" }}></View>
          <View
            style={[
              tableStyles.column,
              tableStyles.table,
              { backgroundColor: "#e5e7eb" },
            ]}
          >
            <View style={[tableStyles.row, tableStyles.table]}>
              <Text style={tableStyles.cell4}>{labels.totalBeforeVat}</Text>
              <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                {estimateHail.currency}{" "}
                {(Number(estimateHail?.retainedPrice) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={[tableStyles.row, tableStyles.table]}>
              <Text style={tableStyles.cell4}>
                {labels.vat} (
                {estimateHail?.client?.vatRate > 0
                  ? estimateHail?.client?.vatRate
                  : companyData?.vatRate}
                %)
              </Text>
              <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                {estimateHail.currency}{" "}
                {(
                  ((estimateHail?.client?.vatRate
                    ? estimateHail?.client?.vatRate
                    : companyData?.vatRate) /
                    100) *
                  (Number(estimateHail?.retainedPrice) / 100)
                ).toFixed(2)}
              </Text>
            </View>
            <View style={[tableStyles.row, tableStyles.table]}>
              <Text style={tableStyles.cell4}>{labels.totalInclVat}</Text>
              <Text style={[tableStyles.cell4, { textAlign: "right" }]}>
                {estimateHail.currency}{" "}
                {(
                  Number(estimateHail?.retainedPrice) / 100 +
                  ((estimateHail?.client?.vatRate
                    ? estimateHail?.client?.vatRate
                    : companyData?.vatRate) /
                    100) *
                    (Number(estimateHail?.retainedPrice) / 100)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={footer.section}>
          <View>
            <Text style={footer.title}>{companyData?.name}</Text>
            <View style={footer.body}>
              <Text>{companyData?.address}</Text>
              <Text>{companyData?.city}</Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                backgroundColor: "#e5e7eb",
                padding: 8,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: "ultrabold",
              }}
            >
              {companyData?.phone}
            </Text>
          </View>
          {/* <View>
            <Text style={footer.subtitle}>{labels.bankDetails}</Text>
            <View style={footer.body}>
              <Text>{companyPayment?.bankName}</Text>
            </View>
            <View style={footer.body}>
              <Text>
                {labels.iban} {companyPayment?.iban}
              </Text>
            </View>
            <View style={footer.body}>
              <Text>
                {labels.bic} {companyPayment?.bic}
              </Text>
            </View>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};
