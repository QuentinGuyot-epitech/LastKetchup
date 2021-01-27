import React, { Component } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2';

export default class statistics1 extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            myobjIdRate: [],
            labels: [],
            data: [],
            backgroundColor: []
        }
    }
    async componentDidMount() {
        const resMovies = await fetch("http://localhost:3000/api/movies")
            .then(res => res.json())
            .then(res => res.data)

        const resRates = await fetch("http://localhost:3000/api/rate")
            .then(res => res.json())
            .then(res => res.data)

        const objIdRate = {};
        //create dict of objs key = movieId and value = array of rates
        resRates.map(myrate => {
            if (myrate.movieId in objIdRate) {
                objIdRate[myrate.movieId].push(myrate.rate);
            } else {
                objIdRate[myrate.movieId] = [myrate.rate];
            }
        })

        // 1st : transform the previous dict and convert array of rates to average rate
        // 2nd create an array label with title movie
        // 3rd create an array data with avg rate
        const data = [];
        const labels = [];
        const backgroundColor = [];
        Object.keys(objIdRate).map(key => {
            let total = 0;
            for (let i = 0; i < objIdRate[key].length; i++) {
                total += objIdRate[key][i];
            }
            let avg = total / objIdRate[key].length;
            objIdRate[key] = avg;
            resMovies.map(movie => {
                if (movie._id == key) {
                    labels.push(movie.title)
                }
            })
            data.push(avg)
            backgroundColor.push(this.random_rgba())
        });
        this.setState({ myobjIdRate: objIdRate })
        this.setState({ data: data })
        this.setState({ labels: labels })
        this.setState({ backgroundColor: backgroundColor })

        this.setState({
            chartData: {
                labels: this.state.labels, //titles
                datasets: [
                    {
                        label: 'Rate',
                        data: this.state.data,
                        backgroundColor: this.state.backgroundColor,
                    }
                ],
            }
        });
    }

    random_rgba = () => {
        const color = ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)']

        const random = Math.floor(Math.random() * color.length);
        return color[random];
        // var o = Math.round, r = Math.random, s = 255;
        // return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + '0.4' + ')';
    }

    static defaultProps = {
        displayTitle: true,
        legendPosition: 'right'
    }

    render() {
        return (
            <div className="chart" style={{ paddingTop: "150px", color: "white" }}>
                <Bar
                    data={this.state.chartData}
                    width={150}
                    height={50}
                    options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    min: 0
                                }
                            }]
                        },
                        title: {
                            display: this.props.displayTitle,
                            text: 'Average rating per movie ',
                            fontSize: 20,
                            padding: 50,
                            fontStyle: "normal",
                            fontColor: '#fff',
                            fontFamily: 'sans-serif'
                        },
                        legend: {
                            display: false,
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        }
                    }}
                />
            </div>
        )
    }
}