import React, { Component } from 'react';
import Link from "next/link";
import styles from "../../../styles/Movies.module.css"
import StarRatings from 'react-star-ratings';
import Swal from 'sweetalert2'

export default class UserMovies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: '',
            success: false,
            fail: false,
            favmovielist: {},
            movie: {},
            hover: false,
            idDelete: "",
            movieIdinFavList: [],
            inFavList: false
        }
    }

    async componentDidMount() {
        if (this.props.user) {
            this.setState({ favmovielist: this.props.favmovielist })
            this.setState({ movieIdinFavList: this.props.favmovielist.moviesId })
        }
        //this.isInFavListId(this.props.movie._id)
    }

    openSweetAlertOk() {
        Swal.fire({
            title: 'Success',
            text: 'Movie successfully added to your fav list',
            icon: "success",
        })
    }

    openSweetAlertError() {
        Swal.fire({
            title: 'Error',
            text: 'Movie is already in yourfav list',
            icon: "error",
        })
    }

    onClick = () => {
        this.setState({ favmovielist: this.state.favmovielist.moviesId.push(this.props.movie._id) })
        // this.setState({ movieIdinFavList: this.state.movieIdinFavList.push(this.props.movie._id) })
        const newFavList = {
            moviesId: this.state.favmovielist.moviesId,
        }
        fetch(`http://localhost:3000/api/favmovies/${this.state.favmovielist._id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newFavList)
        }).then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.openSweetAlertOk()
                }
                if (!res) {
                    this.openSweetAlertError()
                }
            })
        //this.isInFavListId(this.props.movie._id)
    }

    toggleHover = () => {
        this.setState({ hover: !this.state.hover })
    }

    onRemove = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3000/api/movies/${e.target.value}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ idDelete: res.data.id })
                this.props.removeID(this.state.idDelete)
            })
    }

    isInFavListId = (id) => {
        return this.state.movieIdinFavList.includes(id)
    }


    render() {
        const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'

        var linkStyle;
        if (this.state.hover) {
            linkStyle = { opacity: 0.9 }
        } else if (this.state.hover == false) {
            null
        }

        return (
            <div className={styles.containerImage}>
                {
                    this.props.user == null ?
                        <Link href="/api/auth/login">
                            <a>
                                <img style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} className={styles.imagePoster} src={`${POSTER_PATH}${this.props.movie.poster_path}`} alt={this.props.movie.title}></img>
                                {
                                    this.state.hover ? <div className={styles.starRatings}><StarRatings className={styles.absolute} rating={this.props.movie.vote_average / 2} starDimension="15px" starRatedColor="red" numberOfStars={5} name='rating' /></div> : null
                                }
                            </a>

                        </Link>
                        :

                        <Link href="/component/user-connected/[id]" as={`/component/user-connected/${this.props.movie._id}`}>
                            <a>
                                <img style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} className={styles.imagePoster} src={`${POSTER_PATH}${this.props.movie.poster_path}`} alt={this.props.movie.title}></img>
                                {
                                    this.state.hover ? <div className={styles.starRatings}><StarRatings className={styles.absolute} rating={this.props.movie.vote_average / 2} starDimension="17px" starRatedColor="red" numberOfStars={5} name='rating' /></div> : null
                                }
                            </a>

                        </Link>
                }
                {
                    this.props.user == null || this.props.user['http://isadmin/user_metadata'].isAdmin == true
                        ?
                        <p></p>
                        :
                        <div>
                            {
                                this.isInFavListId(this.props.movie._id) ?
                                    <p></p>
                                    :
                                    <button className={styles.buttonImage} onClick={this.onClick}>+</button>

                            }
                        </div>
                }
                {
                    this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin == true
                        ?
                        <button className={styles.buttonImage} value={this.props.movie._id} onClick={this.onRemove}>-</button>
                        :
                        <p></p>
                }
                {this.state.success ? <p className={styles.success}>{this.state.success}</p> : null}
                {this.state.fail ? <p className={styles.fail}>{this.state.fail}</p> : null}
            </div>
        )
    }
}
