import React,{useEffect,useState} from "react"
import { useRouter } from 'next/router'
import Link from "next/link"
import styles from "../../../../styles/Movies.module.css"
import styled from 'styled-components'

import auth0 from '../../../api/utils/auth0'

const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'
const BACKDROP_PATH ='http://image.tmdb.org/t/p/w1280'

const SingleMovie = () => {


    const [movie,setMovie] = useState({})
    const [error,setError] = useState(false)
    const [video,setVideo] = useState({})
    const [param1, setParam1]=useState("");
    const [toggle,setToggle] =useState(false)
    const router = useRouter()

    const fetchSingleMovie = () => {

        fetch(`https://api.themoviedb.org/3/movie/${router.query.id}?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US`)
        .then(res => res.json())
        .then(res => setMovie(res))
        .catch(err => setError(true))

        fetch(`https://api.themoviedb.org/3/movie/${router.query.id}/videos?api_key=e75b3b837766a2de9df33e8ebbb906ff&language=en-US`)
        .then(res => res.json())
        .then(res =>{
            if(res.results != undefined){
                setVideo(res.results[0])
            }
        })

    }

    useEffect(() => {
        if (router && router.query) {
            setParam1(router.query.id);
        }
        fetchSingleMovie()
    }, [router])


    const toggleComponent  = () => {
        setToggle(!toggle)
    }


    return(
        <div>
            <MovieWrapper backdrop={`${BACKDROP_PATH}${movie.backdrop_path}`}>
              <div>
                  <div className={styles.containerInfo}>
                      <img  className={styles.imagePosterSingleMovie} src={`${POSTER_PATH}${movie.poster_path}`} alt={movie.title} />
                        <div>
                          <h1>{movie.title}</h1>
                          <h3>{movie.release_date}</h3>
                          <p>{movie.overview}</p>
                        </div>
                  </div>
                  <div className={styles.containerTrailer}>
                      {!video ?(<p>The trailer is not available yet</p>):(<iframe width="700" height="315" src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`}></iframe>)} 
                  </div>
              </div>
          </MovieWrapper>
        </div>  
    )
}


export default SingleMovie


const MovieWrapper = styled.div`
position:relative;
padding-top:65vh;
background:url(${props => props.backdrop}) no-repeat;
background-size:cover;
`
export async function getServerSideProps(context) {
    //GET the logged in user
    const session = await auth0.getSession(context.req);
    return {
        props: {
            user: session?.user || null,
        },
    };
}