import React, { Component } from 'react'
import Stat1 from '../../components/admin/statistics1'
import Stat2 from '../../components/admin/statistics2'
import Stat3 from '../../components/admin/statistics3'
import Router from 'next/router'
import auth0 from "../api/utils/auth0"

export default class statistics extends Component {
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
            <div>
                {this.props.user && this.props.user['http://isadmin/user_metadata'].isAdmin ? (
                    <>
                        <Stat1></Stat1>
                        <Stat2></Stat2>
                        <Stat3></Stat3>
                    </>
                ) :(
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
