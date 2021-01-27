import React from "react"
import styles from "../../../../styles/Movies.module.css"
import Movie from "./Movie"
import auth0 from '../../../api/utils/auth0'
import Router from 'next/router'
// import PopCorn from "../../../../assets/popcorn.svg"

class ListMovies extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            movies: [],
            error: false,
            search: "",
            resultSearchMovie: [],
            idApiMovieDb: [],
        }
    }

    async componentDidMount() {
        if ( this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin){
            const response = await fetch("http://localhost:3000/api/movies")
                .then(res => res.json())
                .then(res => res.data)
            this.setState({ idApiMovieDb: response.map(movie => movie.api_id) })

            let concatArray = []

            const responseTwo = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US&page=1")
                .then(res => res.json())
                .then(res => res.results)

            const responseThree = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US&page=1&page=2")
                .then(res => res.json())
                .then(res => res.results)

            const responseFour = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US&page=1&page=3")
                .then(res => res.json())
                .then(res => res.results)

            const responseFith = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US&page=1&page=4")
                .then(res => res.json())
                .then(res => res.results)


            let newArray = []
            concatArray.push(responseThree, responseTwo, responseFour, responseFith)
            concatArray.map(array => {
                array.map(movie => {
                    newArray.push(movie)
                })
            })
            this.setState({ movies: newArray })
            this.filterMovie()
        }else{
            Router.push('/')
        }
    }
    ///TO REMEMBER///
    isInArray = (value, array) => {
        return array.indexOf(value) > -1;
    }

    filterMovie = () => {
        let tmp = this.state.movies
        let newArray = []
        tmp.map(movie => {
            if (!this.isInArray(movie.id.toString(), this.state.idApiMovieDb)) {
                newArray.push(movie)
            }
        })

        this.setState({ movies: newArray })

    }

    filterMovieSearch(movies) {
        let newArray = []
        movies.map(movie => {
            if (!this.isInArray(movie.id.toString(), this.state.idApiMovieDb)) {
                newArray.push(movie)
            }
        })

        this.setState({ resultSearchMovie: newArray })
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value })

    onSubmit = (e) => {
        e.preventDefault()
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US&query=${this.state.search}&page=1&include_adult=false`)
            .then(res => res.json())
            .then(res => this.filterMovieSearch(res.results))

        this.setState({ search: "" })
    }
    onClick = (e) => {
        e.preventDefault()

        fetch(`https://api.themoviedb.org/3/movie/${e.target.value}?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US`)
            .then(res => res.json())
            .then(res => res)
            .then(res => {

                let newMovie = {
                    backdrop_path: res.backdrop_path,
                    api_id: res.id.toString(),
                    original_language: res.original_language,
                    overview: res.overview,
                    poster_path: res.poster_path,
                    release_date: res.release_date,
                    title: res.title,
                    genre_ids: res.genres,
                    vote_average: res.vote_average,
                    vote_count: res.vote_count,
                }

                const updateState = this.state.movies.filter(movie => {
                    return movie.id.toString() !== newMovie.api_id
                })
                this.setState({ movies: updateState })

                fetch("http://localhost:3000/api/movies", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newMovie)
                }).then(res => res.json())
                    .then(res => {
                        res
                    })

            })
    }

    render() {

        return (
            <div>
                {this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                    <>
                <div className={styles.searchingMovie}>
                    <form onSubmit={this.onSubmit}>
                        <input className={styles.inputSearch} type="text" onChange={this.onChange} name="search" value={this.state.search}></input>
                    </form>
                </div>
                <div className={styles.containerMovies}>
                    {
                        this.state.resultSearchMovie.length == 0 ? this.state.movies.map(movie =>
                            <div key={movie.id} >
                                <Movie movie={movie} />
                                <button className={styles.buttonAddDb} value={movie.id} onClick={this.onClick}>+</button>
                            </div>)
                            :
                            this.state.resultSearchMovie.map(movie =>
                                <div key={movie.id}>
                                    <Movie movie={movie} />
                                    <button className={styles.buttonAddDb} value={movie.id} onClick={this.onClick}>+</button>
                                </div>
                            )
                    }
                </div>
                </>
                ) : (
                    ''
                 )}
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

export default ListMovies