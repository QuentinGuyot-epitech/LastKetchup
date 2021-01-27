import React from "react";
import Link from "next/link";
import styles from '../../styles/NavBar.module.css';
// import auth0 from '../api/utils/auth0';


export default function NavBar({ children }) {
    return (
        <>
            <div className={styles.containerNavBar}>
                <div className={styles.containerLogo}>
                    LOGO
            </div>
                <div className={styles.containerLink}>
                    {/* <ul className={styles.list}> */}
                    {children.props.user ? (
                        <ul className={styles.listLink}>
                            <li className={styles.item}>Hello {children.props.user.nickname}</li>

                            {
                                children.props.user && children.props.user['http://isadmin/user_metadata'].isAdmin == true
                                    ?
                                    <div className={styles.adminLink}>
                                        <li className={styles.item}><Link user={children.props.user} href="/admin"><a>Dashboard</a></Link></li>
                                        {/* <li className={styles.item}><Link user={children.props.user} href="/component/admin/movies"><a>Movie imDB</a></Link></li> */}
                                    </div>
                                    :
                                    <li className={styles.item}><Link user={children.props.user} href="/profile"><a>Profile</a></Link></li>
                            }
                            <li className={styles.item}><a href="/api/auth/logout">Logout</a></li>

                        </ul>
                    ) : (
                            <ul className={styles.listLink}>
                                <li className={styles.item}><Link href="/"><a>Home</a></Link></li>
                                <li className={styles.item}><a href="/api/auth/login">Sign in / Sign up</a></li>
                            </ul>
                        )}
                    {/* </ul> */}
                </div>
            </div>
            {children}
        </>
    )
}
