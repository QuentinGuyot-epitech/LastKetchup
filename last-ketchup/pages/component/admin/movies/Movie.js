import React,{useState,useEffect} from "react"
import styles from "../../../../styles/Movies.module.css"
import Overdrive from 'react-overdrive'
import Link from "next/link"
import auth0 from '../../../api/utils/auth0'


const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'


const Movie = ({movie}) => {

    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [hover,setHover] = useState(false)

    const toggleHover = () =>{
        setHover(!hover)
    }

    var linkStyle;
    if (hover) {
      linkStyle = {opacity:0.3}
    }

    return (
        <div className={styles.containerImage}>
            <Link href="/component/admin/movies/[id]" as={`/component/admin/movies/${movie.id}`}>
                {!movie.poster_path ? <a><div className={styles.noImage}><p>Poster not available</p></div></a>: <a><img style={linkStyle} onMouseEnter={toggleHover} onMouseLeave={toggleHover} className={styles.imagePoster} src={`${POSTER_PATH}${movie.poster_path}`} alt={movie.title}></img></a> }
            </Link>
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

export default Movie
