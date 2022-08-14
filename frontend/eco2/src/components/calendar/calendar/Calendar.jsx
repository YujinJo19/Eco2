import { addMonths, format, subMonths } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { calendar } from "../../../store/user/accountSlice";
import CalendarBody from "../calendarBody/CalendarBody";
import CalendarDays from "../calendarDays/CalendarDays";
import CalendarHeader from "../calendarHeader/CalendarHeader";
import styles from "./Calendar.module.css";

const Calendar = ({ id }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rewardDate, setRewardDate] = useState([]);
  // const []

  const dispatch = useDispatch();

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  useEffect(() => {
    dispatch(calendar({ id })).then((res) => {
      if (res.payload.status === 200) {
        setRewardDate(res.payload.calendarList);
      }
    });
  }, []);
  return (
    <div className={styles.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarDays />
      <CalendarBody
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
        rewardDate={rewardDate}
      />
    </div>
  );
};

export default Calendar;
