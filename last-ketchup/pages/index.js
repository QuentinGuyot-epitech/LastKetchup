import NavBar from "./component/Navbar"
import UserListMovies from "./component/user-connected/UserListMovies"
import styles from "../styles/Index.module.css"
import auth0 from './api/utils/auth0'

export default function Home({user}) {
  return (
    <div>
      <div className={styles.containerDisplay}>
        <UserListMovies user={user}/>
      </div>
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