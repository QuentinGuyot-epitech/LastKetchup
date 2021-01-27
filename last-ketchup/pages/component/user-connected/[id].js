import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import NavBar from "../Navbar"
import { Button } from 'react-bootstrap';
import styles from "../../../styles/Movies.module.css"
import styled from 'styled-components'
import Link from "next/link"

import auth0 from '../../api/utils/auth0'

const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'
const BACKDROP_PATH = 'http://image.tmdb.org/t/p/w1280'

const SingleMovie = ({ user }) => {


    const [movie, setMovie] = useState({})
    const [error, setError] = useState(false)
    const [video, setVideo] = useState({})
    const [param1, setParam1] = useState("");
    const [toggle, setToggle] = useState(false)
    const [description, setDescription] = useState("")
    const router = useRouter()

    const fetchSingleMovie = () => {

        fetch(`/api/movies/${router.query.id}`)
            .then(res => res.json())
            .then(res => {
                setMovie(res.data)
                setDescription(res.data.overview)
                fetch(`https://api.themoviedb.org/3/movie/${res.data.api_id}/videos?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.results != undefined) {
                            setVideo(res.results[0])
                        }
                    })
            })
            .catch(err => setError(true))

    }

    useEffect(() => {
        if (router && router.query) {
            setParam1(router.query.param1);
        }
        fetchSingleMovie()
    }, [router])


    const toggleComponent = () => {
        setToggle(!toggle)
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value)
    }

    const upadateDescription = () => {
        if (description) {
            fetch(`http://localhost:3000/api/movies/${router.query.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'overview': description })
            })
        }
    }

    return (
        <div>
            <MovieWrapper backdrop={`${BACKDROP_PATH}${movie.backdrop_path}`}>
                <div>
                    <div className={styles.containerInfo}>
                        <img className={styles.imagePosterSingleMovie} src={`${POSTER_PATH}${movie.poster_path}`} alt={movie.title} />
                        <div>
                            <h1>{movie.title}</h1>
                            <h3>{movie.release_date}</h3>
                            {user && user['http://isadmin/user_metadata'].isAdmin == true ?
                                <div>
                                    <textarea onChange={onChangeDescription} className={styles.description} value={description} onSubmit={upadateDescription}></textarea>
                                    <Button variant="dark" style={{ marginLeft: "90%", marginTop: "10px" }} onClick={upadateDescription} >Save</Button>
                                </div>
                                :
                                <p>{movie.overview}</p>
                            }
                        </div>
                    </div>
                    <div className={styles.linkComment}>
                            <Link href="/component/user-connected/comment/[id]" as={`/component/user-connected/comment/${router.query.id}`}>Comment</Link>
                    </div>
                    <div className={styles.containerTrailer}>
                        <div>
                            {!video ? (<p>The trailer is not available yet</p>) : (<iframe width="700" height="315" src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`}></iframe>)}
                        </div>
                    </div>
                </div>
            </MovieWrapper>
        </div>
    )
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

export default SingleMovie


const MovieWrapper = styled.div`
position:relative;
padding-top:65vh;
background:url(${props => props.backdrop}) no-repeat;
background-size:cover;
`