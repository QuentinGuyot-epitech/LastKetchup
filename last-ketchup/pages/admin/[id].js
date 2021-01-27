import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import router from 'next/router'
import auth0 from "../api/utils/auth0"
import Swal from 'sweetalert2'
import Router from 'next/router'

export default class auth0User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            nickname: '',
            isAdmin: true,
            editedUser: '',
        }
    }

    async componentDidMount() {
        //Check if isAdmin
        if ( this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin){
            await fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${router.query.id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then((data) => {
                this.setState({ editedUser: data })
            })
        this.setState({ email: this.state.editedUser.email })
        this.setState({ nickname: this.state.editedUser.nickname })
        this.setState({ isAdmin: this.state.editedUser.user_metadata.isAdmin })
        }else{
            Router.push('/')
        }
        
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
    onChangeNickname = (e) => {
        this.setState({
            nickname: e.target.value
        });
    }
    onChangeisAdmin = (e) => {
        this.setState(prevState => ({
            isAdmin: !prevState.isAdmin
        }));
        console.log(this.state.isAdmin)
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

    saveChanges = () => {
        if (this.state.password == "" && !router.query.id.includes("google")) {
            fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${router.query.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'nickname': this.state.nickname, 'user_metadata': { "isAdmin": this.state.isAdmin }, 'email': this.state.email, 'connection': 'Username-Password-Authentication' })

            })
                .then(res => res.json())
                .then(res => {
                    if (res.created_at) {
                        this.openSweetAlertOk(res)
                    } else {
                        this.openSweetAlertError(res.message)
                    }
                })
        } else if (this.state.password !== "" && router.query.id.includes("auth")) {
            fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${router.query.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'nickname': this.state.nickname, 'user_metadata': { "isAdmin": this.state.isAdmin }, 'email': this.state.email, 'connection': 'Username-Password-Authentication' })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.created_at) {
                        fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${router.query.id}`, {
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
                            })
                        this.setState({ password: '' })
                        this.openSweetAlertOk(res)
                    } else {
                        this.openSweetAlertError(res.message)
                    }
                })

        } else if (router.query.id.includes("google")) {
            fetch(`https://last-ketchup.eu.auth0.com/api/v2/users/${router.query.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user_metadata': { "isAdmin": this.state.isAdmin } })

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
                { this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                    <div style={{ paddingTop: "150px", width: "50%", marginLeft: "25%" }}>
                        <div style={{display:"flex", justifyContent: "space-between", marginBottom:"50px"}}>
                        <h1 style={{ color: "white" }}>Edit user</h1>
                        </div>
                        <Form>
                            {router.query.id.includes("google") ? (
                                <>
                                    <Form.Group controlId="formGroupEmail">
                                        <Form.Label style={{ color: "white" }}>Email address</Form.Label>
                                        <Form.Control type="email" placeholder={this.state.email} readOnly />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPassword">
                                        <Form.Label style={{ color: "white" }}>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Google accounts password are not updatable..." readOnly />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupUsername">
                                        <Form.Label style={{ color: "white" }}>Username</Form.Label>
                                        <Form.Control type="text" placeholder={this.state.nickname} readOnly />
                                    </Form.Group>
                                </>
                            ) : (
                                    <>
                                        <Form.Group controlId="formGroupEmail">
                                            <Form.Label style={{ color: "white" }}>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" value={this.state.email}
                                                onChange={this.onChangeEmail} />
                                        </Form.Group>
                                        <Form.Group controlId="formGroupPassword">
                                            <Form.Label style={{ color: "white" }}>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={this.state.password}
                                                onChange={this.onChangePassword} />
                                        </Form.Group>
                                        <Form.Group controlId="formGroupUsername">
                                            <Form.Label style={{ color: "white" }}>Username</Form.Label>
                                            <Form.Control type="text" placeholder="Username" value={this.state.nickname}
                                                onChange={this.onChangeNickname} />
                                        </Form.Group>
                                    </>
                                )}
                            {this.state.isAdmin ? (
                                <Form.Group controlId="formBasicCheckbox">
                                    <input defaultChecked={true} type="checkbox" value={this.state.isAdmin} onChange={this.onChangeisAdmin} />
                                    <label style={{ color: "white", marginLeft: "10px" }}>Admin</label>
                                </Form.Group>
                            ) : (
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check style={{ color: "white" }} type="checkbox" value={this.state.isAdmin} onChange={this.onChangeisAdmin} label="Admin" />
                                    </Form.Group>
                                )}
                        </Form>
                        <Button style={{ marginLeft: "94%", marginTop: "30px" }} onClick={this.saveChanges} >Save</Button>
                    </div>
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