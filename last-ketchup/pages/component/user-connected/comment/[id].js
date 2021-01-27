import React, { Component,useEffect,useState } from 'react'
import styles from "../../../../styles/Movies.module.css"
import { useRouter } from 'next/router'
import auth0 from '../../../api/utils/auth0'



const Comment = ({user}) => {

    const [comments,setComments] = useState([])
    const [comment,setComment] = useState("")
    const [movie, setMovie] = useState({})
    const [param1, setParam1]=useState("");
    const router = useRouter()
    const POSTER_PATH = 'http://image.tmdb.org/t/p/w154'


     const fetchComments = ()  =>{
        
        fetch("/api/comments")
        .then(res => res.json())
        .then(res => {
            const filterComment = res.data.filter(comment =>{
              return comment.movieId == router.query.id
            })

            setComments(filterComment)

        })

    }

     const fetchSingleMovie = () => {

        fetch(`/api/movies/${router.query.id}`)
        .then(res => res.json())
        .then(res => setMovie(res.data))

    }


    const onSubmit = (e) => {
        let newState = [...comments]
        e.preventDefault()
       let newComment = {
           userId:user.sub,
           comment:comment,
           movieId:param1
       }
        fetch("/api/comments",{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComment)
        })
        .then(res => res.json())
        .then(res =>{
            newState.push(res.data)
            setComments(newState)
            setComment("")
        })

    }


    useEffect(() => {
        if (router && router.query) {
            setParam1(router.query.id);
            console.log 
        }
        fetchSingleMovie()
        fetchComments()
    }, [router])

    return(
        <div className={styles.containerComment}>
            <div className={styles.containerDisplays}>
                <h1>Comment</h1>
                    {comments.map(comment =>(
                        <div className={styles.containerInfos}>
                            <p style={{color:"white"}}>{comment.comment}</p>
                            <p>{comment.createdAt}</p>
                        </div>
                    ))}
            </div>
            <form className={styles.formComment} onSubmit={onSubmit}>
                <input className={styles.textComment} type="text"  onChange={e => setComment(e.target.value)} name="comment" value={comment}/>
                <input className={styles.btnComment} type="submit" name="btn" value="New comment"/>
            </form>
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

export default Comment


