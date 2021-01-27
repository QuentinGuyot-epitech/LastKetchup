import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import Link from "next/link"
import styles from "../../styles/Admin.module.css"
import auth0 from "../api/utils/auth0"
import Swal from 'sweetalert2'
import Router from 'next/router'
import Image from 'next/image'



export default class adminUsers extends Component {


    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        //Check if isAdmin
        if (!this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin) {
            Router.push('/')
        }
    }

    render() {
        return (
            <div className={styles.containerDashboard}>
                { this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                    <>
                        <Card style={{ width: '18rem', margin: 50 }}>
                            <Card.Img variant="top" src="/irobot.jpg" />
                            <Card.Body>
                                <Card.Title>Users table</Card.Title>
                                <Card.Text>
                                    - Show all users <br />
                                    - Delete users <br />
                                    - Update email and password <br />
                                </Card.Text>
                                <div className={styles.link}>
                                    <Link href="/admin/users"><a><Image
                                        src="/link.png"
                                        alt="robot"
                                        width={45}
                                        height={45}
                                    /></a></Link>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card style={{ width: '18rem', margin: 50 }}>
                            <Card.Img variant="top" src="/matrix.jpg" />
                            <Card.Body>
                                <Card.Title>Movies API</Card.Title>
                                <Card.Text>
                                    - Add movies to DB <br />
                                    - Show movie's details <br />
                                    - Search all movies in API <br />
                                </Card.Text>
                                <div className={styles.link}>
                                    <Link href="/component/admin/movies"><a><Image
                                        src="/link.png"
                                        alt="robot"
                                        width={45}
                                        height={45}
                                    /></a></Link>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card style={{ width: '18rem', margin: 40 }}>
                            <Card.Img variant="top" src="/stats.jpg" className={styles.img} />
                            <Card.Body>
                                <Card.Title>Statistics</Card.Title>
                                <Card.Text>
                                    - Average rating per movie <br />
                                    - Number of movies per rating <br />
                                    - Distribution of genre <br />
                                </Card.Text>
                                <div className={styles.link}>
                                    <Link href="/admin/statistics"><a><Image
                                        src="/link.png"
                                        alt="robot"
                                        width={45}
                                        height={45}
                                    /></a></Link>
                                </div>
                            </Card.Body>
                        </Card>
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
