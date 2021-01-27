import React, { Component } from 'react';
import Link from "next/link";
import { Form, Button } from 'react-bootstrap';
import styles from "../../../styles/Movies.module.css"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

export default class UserMovies extends Component {
    constructor() {
        super()
        this.state = {
            moviesId: [],
            session: '',
            rate: 0,
            rates: [],
            alreadyRated: false
        }
    }

    async componentDidMount() {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            this.setState({
                session: await res.json()
            })
        }

        await fetch('api/rate')
            .then(res => res.json()
                .then(res => this.setState({ rates: res.data })))

        this.state.rates.map(rate => {
            if (rate.movieId == this.props.movie._id && rate.userId == this.state.session.sub) {
                this.setState({ alreadyRated: true })
                this.setState({ rate: rate.rate })
            }
        })
    }

    giveRate = (e) => {
        this.setState({ rate: this.state.rate })
        fetch('/api/rate', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'userId': this.state.session.sub,
                    'movieId': this.props.movie._id,
                    'rate': parseInt(this.state.rate)
                })
        }).then(res => console.log(res))
        this.setState({ alreadyRated: true })
    }

    render() {
        const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'
        return (
            <div>
                <div className={styles.containerImage}>
                    <Link href="/component/user-connected/[id]" as={`/component/user-connected/${this.props.movie._id}`}>
                        <a><img className={styles.imagePoster} src={`${POSTER_PATH}${this.props.movie.poster_path}`} alt={this.props.movie.title}></img></a>
                    </Link>
                </div>
                <div>
                    {this.state.alreadyRated ?
                        <div style={{ color: "white", marginTop: "5%" }}> Your rate : {this.state.rate} / 10</div>
                        :
                        <div className={styles.slider}>
                            <div className='d-flex justify-content-center' style={{ width: "35%", marginRight: "7%" }}>
                                <RangeSlider
                                    value={this.state.rate}
                                    min={0}
                                    max={10}
                                    step={1}
                                    size='sm'
                                    variant='light'
                                    onChange={changeEvent => this.setState({ rate: changeEvent.target.value })}
                                />
                            </div>
                            <Button className={styles.ratebutton} value={this.props.movie.api_id} onClick={this.giveRate}>Send</Button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
