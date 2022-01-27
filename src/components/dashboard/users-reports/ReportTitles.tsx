import { Fragment, useRef } from "react";
import { Table } from "react-bootstrap";
import { typeReportsValue, typeSums } from "./Reports";
import ReportsChart from "./ReportsChart";
import { useReactToPrint } from "react-to-print";

import classes from "./repports.module.css";
import ComponentToPrint from "./ComponentRef";

import { ExcelDownloadButton } from "@pickk/react-excel";

const ReportTitles: React.FC<{
  reportsValue: typeReportsValue[];
  sumTitles: typeSums[];
}> = (props) => {
  const { reportsValue, sumTitles } = props;

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const nameUserField = ["نام کاربر"];
  const valueField = reportsValue[0]?.report_base_Title.map(
    (item) => item.name
  );

  const thExcell = nameUserField.concat(valueField);

  console.log("reportsValue", reportsValue);

  let tdName = [];
  let tdValue = [];
  let tdExcell = [];

  for (let i = 0; i < reportsValue.length; i++) {
    tdName[i] = [reportsValue[i].name];
    tdValue[i] = reportsValue[i].report_base_Title.map(
      (item) => `${item.spend_time}`
    );
    tdExcell[i] = tdName[i].concat(tdValue[i]);
  }

  // console.log("tdValue", tdValue);
  // console.log("tdName", tdName);
  console.log("tdExcell", tdExcell);

  const dataCsv = [thExcell].concat(tdExcell);

  // const dataExcell = [thExcell, ];

  return (
    <Fragment>
      <ComponentToPrint ref={componentRef} />
      {reportsValue.length === 0 && (
        <h4 className="text-center mt-3 bg-light p-3 w-100">
          تاریخ مورد نظر را انتخاب کنید!
        </h4>
      )}

      {reportsValue.length > 0 && (
        <div ref={componentRef} className="divPrint">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>نام کاربر</th>
                {reportsValue[0]?.report_base_Title.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportsValue.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  {item.report_base_Title.map((item, index) => (
                    <td key={index}>{item.spend_time}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <ReportsChart chartValue={sumTitles} />
        </div>
      )}
      <div className={classes.print}>
        <button onClick={handlePrint}>پرینت</button>
      </div>
      <div className={classes.excell}>
        <ExcelDownloadButton fileName="touskaReports" data={dataCsv} />
      </div>
    </Fragment>
  );
};

export default ReportTitles;
