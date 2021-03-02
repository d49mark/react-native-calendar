import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {isValidDate} from './utils';

export const MyCalendar = (props) => {
  const [activeDate, setActiveDate] = useState(new Date());
  const [dateMatrix, setDateMatrix] = useState([]);
  const [weekMatrix, setWeekMatrix] = useState([]);
  const [inputDate, setDate] = useState('');
  const [inputDemandDate, setInputDemandDate] = useState('');
  const [weekDateError, setWeekDateError] = useState('');
  const [demandDateError, setDemandDateError] = useState('');

  useEffect(() => {
    setDateMatrix(generateMatrix());
  }, [activeDate]);
  useEffect(() => {
    if (inputDate.length === 10 && isValidDate(inputDate)) {
      setWeekDateError('');
      setWeekMatrix(generateWeekMatrix());
    }
  }, [inputDate]);

  useEffect(() => {
    if (isValidDate(inputDemandDate)) {
      setDateMatrix(generateMatrix());
    }
  }, [inputDemandDate, activeDate]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateWeekMatrix = () => {
    var dateObject = new Date(inputDate);
    let weekMatrix = [];
    // Create header
    weekMatrix[0] = weekDays;
    const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const firstDay = new Date(dateObject).getDay();
    let maxDays = nDays[month];
    if (month == 1) {
      // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
    let counter = dateObject.getDate();
    let counter_stop = counter + 7 > maxDays ? maxDays : counter + 7;
    for (let row = 1; row < 3; row++) {
      weekMatrix[row] = [];
      for (let col = 0; col < 7; col++) {
        weekMatrix[row][col] = -1;
        if (row == 1 && col >= firstDay && counter <= counter_stop) {
          console.log('counter', firstDay);
          // Fill in rows only after the first day of the month
          weekMatrix[row][col] = counter++;
        } else if (row > 1 && counter <= counter_stop) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          weekMatrix[row][col] = counter++;
        }
      }
    }
    return weekMatrix;
  };

  const generateMatrix = () => {
    let matrix = [];
    // Create header
    matrix[0] = weekDays;
    const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    let maxDays = nDays[month];
    if (month == 1) {
      // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }
    return matrix;
  };

  const changeMonth = (n) => {
    const currentMonth = activeDate.getMonth() + n;
    let currentDate = activeDate;
    currentDate.setMonth(currentMonth);
    setActiveDate(new Date(currentDate));
  };

  const getWeekRows = () => {
    return weekMatrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        return (
          <Text
            style={{
              flex: 1,
              height: 18,
              textAlign: 'center',
              // Highlight header
              backgroundColor: rowIndex == 0 ? '#ddd' : '#fff',
              // Highlight Sundays
              color: colIndex == 0 ? '#a00' : '#000',
              // // Highlight current date
              // fontWeight: item == activeDate.getDate()
              //                     ? 'bold': ''
            }}>
            {item != -1 ? item : ''}
          </Text>
        );
      });
      return <View style={styles.calendar}>{rowItems}</View>;
    });
  };
  const getRows = () => {
    return dateMatrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        return (
          <Text
            style={{
              flex: 1,
              height: 18,
              textAlign: 'center',
              // Highlight header
              backgroundColor:
                item === activeDate.getDate() &&
                new Date().getYear() === activeDate.getYear() &&
                new Date().getMonth() === activeDate.getMonth()
                  ? 'green'
                  : item === activeDate.getDate() &&
                    new Date(inputDemandDate).getYear() ===
                      activeDate.getYear() &&
                    new Date(inputDemandDate).getMonth() ===
                      activeDate.getMonth()
                  ? 'yellow'
                  : rowIndex == 0
                  ? '#ddd'
                  : '#fff',
              // Highlight Sundays
              color: colIndex == 0 ? '#a00' : '#000',
              // // Highlight current date
              // fontWeight: item == activeDate.getDate()
              //                     ? 'bold': ''
            }}>
            {item != -1 ? item : ''}
          </Text>
        );
      });
      return <View style={styles.calendar}>{rowItems}</View>;
    });
  };
  return (
    <KeyboardAvoidingView style={{flexGrow: 1}} behavior="height">
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          textAlign: 'center',
        }}>
        {months[activeDate.getMonth()]} &nbsp;
        {activeDate.getFullYear()}
      </Text>
      {getRows()}
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={() => changeMonth(-1)} />
        <Button title="Next" onPress={() => changeMonth(+1)} />
      </View>
      <View style={styles.inputContainer}>
        <Text>Enter a date to see the week</Text>
        <TextInput
          placeholder={'Enter the date to display week in  MM/DD/YYYY format'}
          style={styles.input}
          onChangeText={(text) => {
            if (!isValidDate(text) && text.length === 10) {
              setWeekDateError('Please enter valid date');
            }
            setDate(text);
          }}
          value={inputDate.toString()}
        />
        <Text style={styles.errorText}>{weekDateError}</Text>
        {getWeekRows()}
      </View>
      <View style={styles.inputContainer}>
        <Text>Enter a date to open the month</Text>
        <TextInput
          placeholder={'Enter the date you wish to see in MM/DD/YYYY format'}
          style={styles.input}
          onChangeText={(text) => {
            if (isValidDate(text)) {
              setDemandDateError('');
              setActiveDate(new Date(text));
            } else {
              if (text.length === 10) {
                setDemandDateError('Please enter valid date');
              }
            }
            setInputDemandDate(text);
          }}
          value={inputDemandDate.toString()}
        />
        <Text style={styles.errorText}>{demandDateError}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },

  inputContainer: {
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
  },
  calendar: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
