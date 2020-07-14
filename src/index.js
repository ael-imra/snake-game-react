import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Grid extends Component {
    constructor() {
        super();
        this.state = this.init();
        this.move = {
            x: {
                38: 0,
                39: 1,
                40: 0,
                37: -1,
            },
            y: {
                38: -1,
                39: 0,
                40: 1,
                37: 0,
            },
        };
        this.speed = 200;
        this.interval = "";
        this.foodInterval = "";
    }
    init() {
        return {
            ...this.items(),
            victor: [],
            food: [],
            lose: false,
            key: 0,
            score: 0,
            counter: 30,
            gameState: "paused",
        };
    }
    items() {
        let squares = new Array(40);
        for (let i = 0; i < 40; i++) {
            let arr = new Array(40);
            for (let j = 0; j < 40; j++)
                arr[j] = {
                    className: "S-Row",
                    key: `${i}-${j}`,
                };
            squares[i] = arr;
        }
        return { items: squares };
    }
    victor() {
        const x = Math.floor(Math.random() * 20),
            y = Math.floor(Math.random() * 20),
            index = Math.floor(Math.random() * 4),
            move = [38, 39, 37, 40];
        let arr = [{ x, y, moveX: 0, moveY: 0 }];
        this.setState({ victor: arr, key: move[index] });
    }
    findIndex = (x, y, findFoodIndex = false) => {
        const vic = findFoodIndex ? this.state.food : this.state.victor;
        for (let i = 0; i < vic.length; i++)
            if (vic[i].x === x && vic[i].y === y) return "true";
        return "false";
    };
    handlePress = (event) => {
        if (
            event.keyCode === 40 ||
            event.keyCode === 39 ||
            event.keyCode === 37 ||
            event.keyCode === 38
        )
            this.setState({ key: event.keyCode });
    };
    UpdateVictor = () => {
        this.setState((st) => {
            let arr = st.victor,
                score = st.score,
                counter = st.counter,
                len = arr.length - 1;
            for (let i = len; i > 0; i--) arr[i] = { ...arr[i - 1] };
            arr[0].moveX =
                !arr[0].moveX || !this.move["x"][st.key]
                    ? this.move["x"][st.key]
                    : arr[0].moveX;
            arr[0].moveY =
                !arr[0].moveY || !this.move["y"][st.key]
                    ? this.move["y"][st.key]
                    : arr[0].moveY;
            arr[0].x += arr[0].moveX;
            arr[0].y += arr[0].moveY;
            counter++;
            if (counter === 31) {
                counter = 0;
                this.food();
            }
            if (this.findIndex(arr[0].x, arr[0].y, true) === "true") {
                this.food();
                counter = 0;
                arr.push({ ...arr[len] });
                len = arr.length - 2;
                for (let i = len; i > 0; i--) arr[i] = { ...arr[i - 1] };
                arr[0].x += arr[0].moveX;
                arr[0].y += arr[0].moveY;
                score++;
            }
            return { victor: arr, score: score, counter: counter };
        });
        this.isLose();
    };
    food = () => {
        let x = Math.floor(Math.random() * 20),
            y = Math.floor(Math.random() * 20);
        while (this.findIndex(x, y) === "true") {
            x = Math.floor(Math.random() * 20);
            y = Math.floor(Math.random() * 20);
        }
        this.setState({ food: [{ x, y }] });
    };
    isLose = () => {
        let vic = this.state.victor;
        if (vic[0].x < 0 || vic[0].x >= 40 || vic[0].y >= 40 || vic[0].y < 0)
            this.setState({ lose: true });
        for (let i = 1; i < vic.length; i++)
            if (vic[0].x === vic[i].x && vic[0].y === vic[i].y)
                this.setState({ lose: true });
    };
    componentWillMount() {
        this.victor();
    }
    componentDidMount() {
        window.addEventListener("keydown", this.handlePress);
    }
    start = () => {
        if (!this.interval && !this.state.lose) {
            this.interval = setInterval(this.UpdateVictor, this.speed);
            this.setState({ gameState: "running" });
        }
    };
    pause = () => {
        if (!this.state.lose && this.interval) {
            clearInterval(this.interval);
            this.interval = "";
            this.setState({ gameState: "paused" });
        }
    };
    reset = () => {
        this.setState(this.init());
        this.componentWillMount();
        this.componentDidMount();
    };
    render() {
        let grid = this.state.items.map((item, index) => (
            <div className='S-Col' key={index}>
                {item.map((value, idx) => (
                    <div
                        className={value.className}
                        active={this.findIndex(idx, index)}
                        food={this.findIndex(idx, index, true)}
                        key={value.key}
                    ></div>
                ))}
            </div>
        ));
        grid.push(
            <div className='Score' key='41'>
                Score: {this.state.score}
            </div>
        );
        if (this.state.lose) {
            clearInterval(this.interval);
            grid.push(
                <div className='LoseBox' key='43'>
                    <h1>Game Over!</h1>
                    <button onClick={this.reset}>Reset</button>
                </div>
            );
        }
        return (
            <div>
                <div className='GameControl'>
                    <div>
                        <button onClick={this.start}>Start</button>
                        <button onClick={this.pause}>Pause</button>
                    </div>
                    <div>
                        <h1 className='GameState'>{this.state.gameState}</h1>
                    </div>
                </div>
                <div className='Grid'>{grid}</div>
            </div>
        );
    }
}
class App extends Component {
    render() {
        return (
            <div className='App'>
                <Grid />
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById("root"));
