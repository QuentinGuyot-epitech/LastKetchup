import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import auth0 from "../api/utils/auth0"
import Swal from 'sweetalert2'

export default class profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            session: '',
            email: '',
            password: '',
            editedUser: '',
        }
    }

    async componentDidMount() {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            this.setState({
                session: await res.json()
            })
            const response = await fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${this.state.session.sub}`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
            }).then(response => response.json())
                .then((data) => {
                    this.setState({ editedUser: data })
                })
            this.setState({ email: this.state.editedUser.email })
        }
    }

    openSweetAlertError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: "error",
        })
    }

    openSweetAlertOk(message) {
        Swal.fire({
            title: 'Success',
            text: "User " + message.email + " updated",
            icon: "success",
        })
    }


    onChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        });
    }
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    saveChanges = () => {
        if (this.state.password !== "") {
            fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${this.state.session.sub}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'password': this.state.password, 'connection': 'Username-Password-Authentication' })

            })
                .then(res => res.json())
                .then(res => {
                    if (res.created_at) {
                        this.openSweetAlertOk(res)
                    } else {
                        this.openSweetAlertError(res.message)
                    }
                    this.setState({ password: '' })
                })
        }
        if (this.state.email !== "") {
            console.log(this.state.email)
            fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${this.state.session.sub}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': this.state.email, 'connection': 'Username-Password-Authentication' })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.created_at) {
                        this.openSweetAlertOk(res)
                    } else {
                        this.openSweetAlertError(res.message)
                    }
                })
        }
    }

    render() {
        return (
            <div>
                { this.state.session.given_name ?
                    <h4 style={{ color: "white", paddingTop: "100px", marginLeft: "40px" }} > Hey {this.state.session.given_name} </h4>
                    :
                    <h4 style={{ color: "white", paddingTop: "100px", marginLeft: "40px" }} > Hey {this.state.session.nickname} </h4>
                }
                <div style={{ paddingTop: "150px", width: "50%", marginLeft: "25%" }}>
                    <h4 style={{ color: "white" }}>Edit profile</h4>
                    <Form>
                        {this.props.user.sub.includes("google") ? (
                            <>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label style={{ color: "white" }}>Email address</Form.Label>
                                    <Form.Control type="email" placeholder={this.state.email} readOnly />
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label style={{ color: "white" }}>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Google accounts password are not updatable..." readOnly />
                                </Form.Group>
                            </>
                        ) : (
                                <>
                                    <Form.Group controlId="formGroupEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" value={this.state.email}
                                            onChange={this.onChangeEmail} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={this.state.password}
                                            onChange={this.onChangePassword} />
                                    </Form.Group>
                                </>
                            )}
                    </Form>
                    {!this.props.user.sub.includes("google") ? (
                    <Button style={{ marginLeft: "94%", marginTop: "30px" }} onClick={this.saveChanges} >Save</Button>
                    ) : (
                        <>
                        <h3 style={{ color: "white" }}>Sorry provider accounts are not updatable</h3>
                        <h3 style={{ color: "white" }}>Please register on our site if you want more options with your profile</h3>
                        </>
                    )}
                </div>
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