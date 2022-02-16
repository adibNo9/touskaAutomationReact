import { Fragment, useRef } from "react";
import { Table } from "react-bootstrap";
import ComponentToPrint from "./ComponentRef";
import { typeReportsValue, typeSums } from "./Reports";
import ReportsChart from "./ReportsChart";
import { useReactToPrint } from "react-to-print";

import classes from "./repports.module.css";

import { ExcelDownloadButton } from "@pickk/react-excel";

const ReportSubtitles: React.FC<{
  reportsValue: typeReportsValue[];
  sumSubtitles: typeSums[];
}> = (props) => {
  const { reportsValue, sumSubtitles } = props;

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const nameUserField = ["نام کاربر"];
  const valueField = reportsValue[0]?.report_base_subTitle.map(
    (item) => item.name
  );

  const thExcell = nameUserField.concat(valueField);

  let tdName = [];
  let tdValue = [];
  let tdExcell = [];

  for (let i = 0; i < reportsValue.length; i++) {
    tdName[i] = [reportsValue[i].name];
    tdValue[i] = reportsValue[i].report_base_subTitle.map(
      (item) => `${item.spend_time}`
    );
    tdExcell[i] = tdName[i].concat(tdValue[i]);
  }

  const dataCsv = [thExcell].concat(tdExcell);

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
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>نام کاربر</th>
                {reportsValue[0]?.report_base_subTitle.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportsValue.map((item) => (
                <tr key={item.id}>
                  <td>{item.name ? item.name : item.email}</td>
                  {item.report_base_subTitle.map((item, index) => (
                    <td key={index}>{item.spend_time}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <ReportsChart chartValue={sumSubtitles} />
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

export default ReportSubtitles;
