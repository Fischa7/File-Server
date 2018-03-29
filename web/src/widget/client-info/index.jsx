import React from 'react';

import './index.less'

import ProgressBar from '../progress-bar';

import { Link } from 'react-router-dom'

import {cls} from "../../util/"

export default class ClientInfo extends React.Component {
    displayName: "ClientInfo";

    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            error: null,
            isLoaded: false,
            client: null
        };
    }

    toggleOpen() {
        if (this.state.open) {
            clearInterval(this.interval);
            this.interval = null
        } else {
            this.tick(this);
        }

        this.setState({
            open: !this.state.open
        });
    }

    fetchData() {
        fetch("/api/clientinfo/" + this.props.info.id, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    client: result
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    tick(self) {
        self.fetchData()
        if (self.interval == null) {
            self.interval = setInterval((function(self) {         //Self-executing func which takes 'this' as self
                return function() {   //Return a function in the context of 'self'
                    self.tick(self); //Thing you wanted to run as non-window 'this'
                }
            })(self), 1000);
        }
    }

    componentWillUnmount() {
        if (this.state.open) {
            clearInterval(this.interval);
        }
    }

    render() {

        var _this = this;
        var toggleOpen = function() {
            _this.toggleOpen();
        }


        var active_info = this.props.info;
        var content = "";

        if (this.state.open && this.state.client != null) {

            var info = this.state.client;

            var time = new Date(info.time*1000);
            var today = new Date();
            var timeString = time.getHours() + ':' + ("0" + time.getMinutes()).substr(-2) + ':' + ("0" + time.getSeconds()).substr(-2);

            if (time.date != today.date) {
                 timeString += " " + time.getDate() + " " + time.getMonth() 
            }

            var progress_bar = ""
            if (info.transferring != null) {

                progress_bar = (
                    <ProgressBar progress={Math.round(info.transfer_progress / info.transferring.file_size * 100)}></ProgressBar>
                )

                progress_bar = (
                    <div style={{textAlign: "center"}}>
                        {info.transferring.file_name}
                        {progress_bar}
                    </div>
                )
            }

            content = (
                <div className={cls(this, "content")}>

                    {progress_bar}
                    <div>{"Connected: " + timeString}</div>
                    <div>{"Files Sent: " + info.files_sent}</div>
                    <div>{"Data Sent: " + info.data_sent}</div>
                    <div>{"Files Recieved: " + info.files_recieved}</div>
                    <div>{"Data Recieved: " + info.data_recieved}</div>
                    <div>{"Queued Packets: " + info.queued_packets}</div>
                    <div>{"Events to ignore: " + info.queued_packets}</div>
                </div>
            )
        }

        return (
            <div className={cls(this)}>
                <div className={cls(this, "header", {open: this.state.open})}>
                    {active_info.address}
                    <div className={cls(this, "right")}>
                        {active_info.status}
                        <div className={cls(this, "showBtn")} onClick={toggleOpen}>
                            {this.state.open ? "-" : "+"}
                        </div>
                    </div>>
                </div>
                {content}
            </div>
        )
        
    }
}