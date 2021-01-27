import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import Link from "next/link"
import styles from "../../styles/Admin.module.css"
import auth0 from "../api/utils/auth0"
import Swal from 'sweetalert2'
import Router from 'next/router'



export default class adminUsers extends Component {


    constructor(props) {
        super(props);
        this.state = {
            all_users: [],
        }
    }

    openSweetAlertOk(message) {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: "success",
        })
    }

    Delete = (e) => {
        fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${e.currentTarget.value}`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                'Content-Type': 'application/json'
            },
        })
        const newusers_array = this.state.all_users.filter((user) => {
            return user.user_id !== e.currentTarget.value
        })
        this.setState({ all_users: newusers_array })
        this.openSweetAlertOk("User Successfully deleted")
    }


    async componentDidMount() {
        //Check if isAdmin
        if (this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin) {
            const all_users = await fetch('https://last-ketchup.eu.auth0.com/api/v2/users', {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
                .then((data) => {
                    this.setState({ all_users: data })
                })
        }
        else {
            Router.push('/')
        }
    }

    renderTableData() {
        return this.state.all_users.map((userauth0) => {
            const { user_id, nickname, user_metadata: { isAdmin }, email } = userauth0
            return (
                <tr key={user_id}>
                    <td style={{ color: "white" }}>{user_id}</td>
                    <td style={{ color: "white" }}>{nickname}</td>
                    <td style={{ color: "white" }}>{email}</td>
                    {isAdmin ? (
                        <td style={{ color: "white" }}>Admin</td>
                    ) : (
                            <td style={{ color: "white" }}>User</td>
                        )}
                    <td><Link href="/admin/[id]" as={`/admin/${user_id}`}><Button variant="light"><a>Edit</a></Button></Link></td>
                    <td><Button variant="danger" value={user_id} onClick={this.Delete}><a>X</a></Button></td>
                </tr>
            )
        })
    }


    render() {
        return (
            <div className={styles.containerDisplay}>
                { this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "40px" }}>
                            <h1 id="title" style={{ color: "white" }} >Admin User</h1>
                            <Link href="/admin/add"><Button variant="light"><a>Add User</a></Button></Link>
                        </div>
                        <div>
                            <Table striped bordered hover >
                                <thead>
                                    <tr>
                                        <th style={{ color: "white" }}>UserID</th>
                                        <th style={{ color: "white" }}>Nickname</th>
                                        <th style={{ color: "white" }}>Email</th>
                                        <th style={{ color: "white" }}>Status</th>
                                        <th style={{ color: "white" }}>Edit</th>
                                        <th style={{ color: "white" }}>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </Table>
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
