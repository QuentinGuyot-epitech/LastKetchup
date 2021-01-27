import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import Link from "next/link"
import NavBar from "./../component/Navbar";
import UserFavMovies from "./../component/user-connected/UserFavMovies"
import styles from "../../styles/Movies.module.css"
import auth0 from "../api/utils/auth0"

export default class profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            session: '',
            email: '',
            password: '',
            favmovielistId: [],
            favmovies: [],
            rate: ''
        }
    }

    async componentDidMount() {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            this.setState({
                session: await res.json()
            })
        }
        await fetch('http://localhost:3000/api/favmovies')
            .then(res => res.json())
            .then(res => this.setState({ favmovielistId: res.data.find(list => list.userId === this.state.session.sub) }));
        await fetch('http://localhost:3000/api/movies')
            .then(res => res.json())
            .then(res => {
                let tmpfavmovie = [];
                let tmpFavMovieIdUnique = [...new Set(this.state.favmovielistId.moviesId)]
                tmpFavMovieIdUnique.map((movieId) => {
                    const tmp = res.data.filter((movie) => {
                        return movie._id == movieId
                    })[0]
                    if (tmp) {
                        tmpfavmovie.push(tmp)
                    }
                })
                this.setState({ favmovies: tmpfavmovie })
            })

    }

    RemoveOnClick = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        let removeMovie = this.state.favmovies
        const tmp = removeMovie.filter((movie) => {
            return movie.api_id !== e.target.value
        });
        let arrayId = [];
        tmp.map((movie) => {
            return arrayId.push(movie._id)
        })
        const newFavList = {
            moviesId: arrayId
        }
        fetch(`http://localhost:3000/api/favmovies/${this.state.favmovielistId._id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newFavList)
        })
        this.setState({ favmovies: tmp });
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <div>
                        {this.state.session.given_name ?
                            <h4 style={{ color: "white", paddingTop: "100px", marginLeft: "40px" }} > Hey {this.state.session.given_name} </h4>
                            :
                            <h4 style={{ color: "white", paddingTop: "100px", marginLeft: "40px" }} > Hey {this.state.session.nickname} </h4>
                        }
                    </div>
                    <div>
                        <Button style={{ marginTop: "100px", marginRight: "40px" }} variant="light"><Link href="/profile/edit"><a>Edit Profile</a></Link></Button>
                    </div>
                </div>
                <h4 style={{ color: "white", marginTop: "20px", marginLeft: "40%" }}>Your favorite movies</h4>
                <div className={styles.containerMovies}>
                    {this.state.favmovies.map(movie =>
                        <div>
                            <button value={movie.api_id} className={styles.buttonDelete} onClick={this.RemoveOnClick}>-</button>
                            <UserFavMovies key={movie._id} movie={movie} />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export async function getServerSideProps(context) {
    //GET the logged in user
    const session = await auth0.getSession(context.req);
    return {
        props: {
            user: session?.user || null,
        },
    };
}