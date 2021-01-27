import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import auth0 from "../api/utils/auth0"
import styles from "../../styles/Admin.module.css"
import Swal from 'sweetalert2'
import Router from 'next/router'


export default class addUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            nickname:'',
            isAdmin: false,
        }
    }

    async componentDidMount(){
        //Check if logged and isAdmin
        if ( this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin){
            
        }else{
            Router.push('/')
        }
    }
    

    openSweetAlertError(message)
    {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: "error",
        })
    }

    openSweetAlertOk(message)
    {
        Swal.fire({
            title: 'Success',
            text: "User " + message.email + " created",
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


   saveChanges = () => {
            fetch('https://last-ketchup.eu.auth0.com/api/v2/users', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' +  process.env.NEXT_PUBLIC_AUTH0_API,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': this.state.email, 'password': this.state.password, 'nickname': this.state.nickname, 'user_metadata': {"isAdmin": this.state.isAdmin},'connection': 'Username-Password-Authentication' })

            })
                .then(res => res.json())
                .then(res => {
                    if (res.created_at){
                        this.openSweetAlertOk(res)
                    }else{
                        this.openSweetAlertError(res.message)
                    }
                })    
            this.setState({ password: '', email:'', nickname:'', isAdmin:'' })
    }

    render() {
        return (
            <div>
               {this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                <div style={{ paddingTop: "150px", width: "50%", marginLeft: "25%" }}>
                    <div style={{display:"flex", justifyContent: "space-between", marginBottom:"50px"}}>
                        <h1 style={{ color: "white" }}>Add user</h1>
                    </div>
                    <Form>
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
                        <Form.Group controlId="formBasicCheckbox">
                        <Form.Check style={{ color: "white"}} type="checkbox" value={this.state.isAdmin} onChange={this.onChangeisAdmin} label="Check if Admin" />
                        </Form.Group>
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