import classes from "./timesheet.module.css";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, {
  DayValue,
  Calendar,
  Day,
} from "react-modern-calendar-datepicker";
import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";

import { MdOutlineClose } from "react-icons/md";
import { typeListTitles } from "../titleandsubtitle/EditTimeSheet";
import { getData } from "../../../lib/get-data";
import TimeSheetForm from "./TimeSheetForm";

const TimeSheet: React.FC = () => {
  const [day, setDay] = useState<DayValue>(null);

  const [showModal, setShowModal] = useState(false);

  const [allTitles, setAllTitles] = useState<typeListTitles[]>([]);
  useEffect(() => {
    const getTitles = async () => {
      const value = await getData("get/getTitleWithsubTitles");
      setAllTitles(value);
    };
    getTitles();
  }, []);

  function convertNumber(fromNum: string) {
    var persianNums = "۰١۲۳۴۵۶۷۸۹";
    return persianNums.indexOf(fromNum);
  }

  const newToday = new Date().toLocaleDateString("fa-ir").split("/");

  const todayObj = {
    day: newToday[2].split(""),
    month: newToday[1].split(""),
    year: newToday[0].split(""),
  };

  console.log("today", todayObj);

  const setDate = (val: string[]) => {
    let value = [];
    for (let i = 0; i < val.length; i++) {
      value[i] = convertNumber(val[i]);
      value[i] = +value[i];
    }

    const posValue = value.map((val) => Math.abs(val));

    return posValue.join("");
  };

  console.log("month:", setDate(todayObj.month));

  const todayDay = setDate(todayObj.day);
  const todayMonth = setDate(todayObj.month);
  const todayYear = setDate(todayObj.year);

  const maxDate = {
    year: +todayYear,
    month: +todayMonth,
    day: +todayDay,
  };

  console.log("maxDate:", maxDate);

  let selectedDate = `${day?.year}/${day?.month}/${day?.day}`;

  useEffect(() => {
    console.log(day);

    if (day !== null) {
      setShowModal(true);
    }
  }, [day]);
  return (
    <section className={classes.timesheet}>
      <h1> تایم شیت </h1>
      <Calendar
        calendarClassName={classes.calendar}
        calendarSelectedDayClassName={classes.selectedDay}
        value={day}
        onChange={setDay}
        locale="fa"
        maximumDate={maxDate}
      />
      {showModal && (
        <Modal>
          <div className={classes.modal}>
            <h3 className={classes.dateOnModal}>{selectedDate}</h3>
            <MdOutlineClose
              className={classes.closeModal}
              onClick={() => setShowModal(false)}
            />
            <TimeSheetForm titles={allTitles} selectedDate={selectedDate} />
          </div>
        </Modal>
      )}
    </section>
  );
};

export default TimeSheet;
