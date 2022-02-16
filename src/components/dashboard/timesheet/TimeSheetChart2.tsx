import { Chart } from "react-google-charts";

import { typeCharts } from "./TimeSheetForm";

const TimeSheetChart2: React.FC<{ chartValue: typeCharts[] }> = (props) => {
  let data: (string | number)[][] = [["Task", "Hours per Day"]];
  const { chartValue } = props;

  const datas = chartValue.map((item) => [
    `${item.title}(${item.category})`,
    +item.spend_time,
  ]);

  const dataFinal = data.concat(datas);

  const options = {
    is3D: true,
    backgroundColor: "transparent",
  };

  return (
    <Chart
      chartType="PieChart"
      data={dataFinal}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
};

export default TimeSheetChart2;
