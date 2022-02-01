import { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import moment from "moment";

function Timer({ interval, style }) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <Text style={style}>
      {pad(duration.minutes())}:{pad(duration.seconds())}:{pad(centiseconds)}
    </Text>
  );
}

function Button({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      activeOpacity={disabled ? 1.0 : 0.6}
      style={{ ...s.btnStart, backgroundColor: background }}
    >
      <View style={s.btnBorder}>
        <Text style={[s.btnTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Lap({ number, interval }) {
  return (
    <View style={s.lap}>
      <Text style={s.lapText}>Коло {number}</Text>
      <Timer style={s.lapText} interval={interval} />
    </View>
  );
}

function LapsRender({ laps, timer }) {
  return (
    <ScrollView style={s.scrollView}>
      {laps.map((lap, inx) => (
        <Lap
          number={laps.length - inx}
          key={laps.length - inx}
          interval={inx === 0 ? timer + lap : lap}
        />
      ))}
    </ScrollView>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      now: 0,
      laps: [],
    };
  }

  start = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
      laps: [0],
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };
  //////lap////
  lap = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    });
  };
  //stop//////
  stop = () => {
    clearInterval(this.timer);
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    });
  };
  ///reset////
  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    });
  };

  resume = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };
  render() {
    const { start, now, laps } = this.state;
    const timer = now - start;
    return (
      <View style={s.container}>
        <Timer
          interval={laps.reduce((total, curr) => total + curr, 0) + timer}
          style={s.timer}
        />
        {laps.length === 0 && (
          <View style={s.wrapBtnS}>
            <Button
              title="Почати"
              background="#0dc50d"
              color="#fff"
              onPress={this.start}
            />
            {/* <Button title="Скинути" background="#f30c3e" color="#fff" /> */}
          </View>
        )}
        {start > 0 && (
          <View style={s.wrapBtn}>
            <Button
              title="Коло"
              background="#0dc50d"
              color="#fff"
              onPress={this.lap}
            />
            <Button
              title="Зупинити"
              background="#f30c3e"
              color="#fff"
              onPress={this.stop}
            />
          </View>
        )}
        {laps.length > 0 && start === 0 && (
          <View style={s.wrapBtn}>
            <Button
              title="Продовжити"
              background="#0dc50d"
              color="#fff"
              onPress={this.resume}
            />
            <Button
              title="Скинути"
              background="#f30c3e"
              color="#fff"
              onPress={this.reset}
            />
          </View>
        )}
        <LapsRender laps={laps} timer={timer} />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f1",
    alignItems: "center",
    paddingTop: 150,
    paddingHorizontal: 10,
  },
  timer: {
    color: "#000",
    fontSize: 70,
    fontWeight: "400",
    borderWidth: 2,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#e5e5e5",
    width: 300,
  },
  btnStart: {
    width: 185,
    height: 70,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitle: {
    fontSize: 30,
  },
  btnBorder: {
    width: 183,
    height: 66,
    borderWidth: 3,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapBtnS: {
    justifyContent: "center",
    marginTop: 50,
  },
  wrapBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginTop: 50,
  },
  lapText: {
    color: "#000",
    fontSize: 30,
  },
  lap: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#151515",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: "stretch",
    marginTop: 50,
  },
});
