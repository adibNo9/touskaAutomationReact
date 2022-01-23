import { Fragment } from "react";
import { Table } from "react-bootstrap";
import { typeReportsValue } from "./Reports";
import ReportsChart from "./ReportsChart";

import classes from "./repports.module.css";

const ReportTitles: React.FC<{
  reportsValue: typeReportsValue[];
}> = (props) => {
  const { reportsValue } = props;
  return (
    <Fragment>
      {reportsValue.length === 0 && (
        <h4 className="text-center mt-3 bg-light p-3 w-100">
          تاریخ مورد نظر را انتخاب کنید!
        </h4>
      )}

      {reportsValue.length > 0 && (
        <div>
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
        </div>
      )}
    </Fragment>
  );
};

export default ReportTitles;
