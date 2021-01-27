import React from "react"
import styles from "../../../styles/Movies.module.css"
import UserMovies from "./UserMovies"

class UserListMovies extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allMovies: [],
            movies: [],
            error: false,
            session: '',
            favmovielist: {},
            search: '',
            filter: false,
            options: [
                {
                    name: "Genres",
                    value: null
                },
                {
                    name: "Actions",
                    value: 28
                },
                {
                    name: "Horror",
                    value: 27
                },
                {
                    name: "Thriller",
                    value: 53
                },
                {
                    name: "Family",
                    value: 35
                },
                {
                    name: "Comedy",
                    value: 10751
                },
                {
                    name: "Crime",
                    value: 80
                }
            ],
            genreValue: "",
            dateValue: ""
        }
    }

    async componentDidMount() {
        if (this.props.user) {

            const res = await fetch('/api/auth/me');
            if (res.ok) {
                this.setState({
                    session: await res.json()
                })
            }

            fetch('http://localhost:3000/api/favmovies')
                .then(res => res.json())
                .then(res => {
                    if (!res.data.find(list => list.userId === this.state.session.sub)) {
                        fetch('http://localhost:3000/api/favmovies', {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ userId: this.state.session.sub })
                        })
                            .then(fetch('http://localhost:3000/api/favmovies')
                                .then(res => res.json())
                                .then(res => this.setState({ favmovielist: res.data.find(list => list.userId === this.state.session.sub) })))
                    }
                    else {
                        this.setState({ favmovielist: res.data.find(list => list.userId === this.state.session.sub) })
                    }
                })
                .catch(err => this.setState({ error: err }))
        }

        fetch("http://localhost:3000/api/movies")
            .then(res => res.json())
            .then(res => this.setState({ movies: res.data, allMovies: res.data }))
            .catch(err => this.setState({ error: err }))

    }

    removeID = (id) => {

        const updateState = this.state.movies.filter(movie => {
            return movie._id !== id
        })

        this.setState({ movies: updateState })
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value })

    onSubmit = (e) => {
        e.preventDefault()
        const filter = this.state.movies.filter(movie => {
            let lowerCase = movie.title.toLowerCase()
            let search = this.state.search.toLowerCase()
            return lowerCase.match(search)
        })
        this.setState({ movies: filter })
        this.setState({ search: '' })

    }

    toggleFilter = () => {
        this.setState({ filter: !this.state.filter })
    }


    onChangeDate = async (e) => {
        await this.setState({ dateValue: e.target.value })
        this.filterDate()
        // console.log(this.state.dateValue)

    }
    filterDate = () => {
        const newArray = this.state.allMovies.filter(movie => {
            return movie.release_date.includes(this.state.dateValue)
        })

        this.setState({ movies: newArray })
    }

    filterGenre = async () => {
        let res = []
        this.state.allMovies.map(movie => {
            movie.genre_ids.find(id => {
                if (id.id == this.state.genreValue) {
                    res.push(movie)
                }
            })
        })
        this.setState({ movies: res })
    }

    onChangeGenres = async (event) => {
        await this.setState({ genreValue: event.target.value })
        this.filterGenre()
        this.setState({ genreValue: "" })

    }


    render() {



        const { options, genreValue } = this.state
        return (
            <div>
                <div className={styles.containerSearchBar}>
                    <form onSubmit={this.onSubmit}>
                        <input className={styles.search} type="text" name="search" onChange={this.onChange}></input>
                    </form>
                    <div>
                        {this.state.filter ?
                            (
                                <div className={styles.containerMoreFilter}>
                                    <button className={styles.btnMoreFilter} onClick={this.toggleFilter}>X</button>
                                    <div className={styles.containerSelect}>
                                        <div className={styles.selectDate}>
                                            <select className={styles.select} name="date" id="date" onChange={this.onChangeDate} value={this.state.dateValue}>
                                                <option value="0">Date</option>
                                                <option value="2021">2021</option>
                                                <option value="2020">2020</option>
                                                <option value="2018">2018</option>
                                                <option value="2017">2017</option>
                                                <option value="2016">2016</option>
                                                <option value="2015">2015</option>
                                                <option value="2014">2014</option>
                                            </select>
                                        </div>
                                        <div className={styles.selectGenre}>
                                            <select className={styles.select} name="genre" id="genre" onChange={this.onChangeGenres} value={genreValue}>
                                                {options.map(item => (
                                                    <option key={item.value} value={item.value}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button className={styles.btnMoreFilter} onClick={this.toggleFilter}>More filter</button>
                            )
                        }
                    </div>
                </div>
                <div className={styles.containerMovies}>
                    {this.state.movies.map(movie => <UserMovies key={movie._id} movie={movie} user={this.props.user} favmovielist={this.state.favmovielist} removeID={this.removeID} />)}
                </div>
            </div>
        )
    }
}

export default UserListMovies