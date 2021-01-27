import React, { Component } from 'react'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

export default class statistics3 extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            labels: [],
            data: [],
            backgroundColor: []
        }
    }
    async componentDidMount() {
        let resMovies = await fetch("http://localhost:3000/api/movies")
            .then(res => res.json())
            .then(res => res.data)

        const objGenreNumber = {};

        resMovies.map(movie => {
            movie.genre_ids.map(genre => {
                if (genre.name in objGenreNumber) {
                    objGenreNumber[genre.name] += 1
                } else {
                    objGenreNumber[genre.name] = 1
                }
            })
        })

        const labels = [];
        const data = [];
        const backgroundColor = [];
        Object.keys(objGenreNumber).map(key => {
            labels.push(key)
            data.push(objGenreNumber[key])
            backgroundColor.push(this.random_rgba())
        })

        this.setState({ labels: labels })
        this.setState({ data: data })
        this.setState({ backgroundColor: backgroundColor })

        this.setState({
            chartData: {
                labels: this.state.labels,
                datasets: [
                    {
                        label: 'Number of movie',
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
                <Doughnut
                    data={this.state.chartData}
                    width={150}
                    height={50}
                    options={{
                        cutoutPercentage: 40,
                        title: {
                            display: this.props.displayTitle,
                            text: 'Distribution of genre movies',
                            fontSize: 20,
                            padding: 50,
                            fontStyle: "normal",
                            fontColor: '#fff',
                            fontFamily: 'sans-serif'
                        },
                        legend: {
                            display: true,
                            labels: {
                                fontColor: '#fff',
                                fontSize: 20,
                                padding: 5
                            },
                            position: this.props.legendPosition
                        }
                    }}
                />
            </div>
        )
    }
}