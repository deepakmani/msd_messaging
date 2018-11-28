import React, { Component } from 'react';
import logo from './logo.svg';
import green_circle from './images/green_circle.png';
import './App.css';
import ReactDOM from 'react-dom';
import { DirectMessage } from './components/DirectMessage.js';
//import { Link, NavLink, Route } from 'react-router-dom' 
import { Switch, Link, NavLink, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom';

import {withRouter} from 'react-router-dom'


class App extends Component {
   constructor (props) {
    
    super(props)
    
    // Initialize local variable
    this.selected_member_to_message = {username: "deepakabs"};
   

     /** @type BrowserRouter */
    this.router = undefined

    // Declare DirectMessageUsers
    this.state = {
      // Set currentUser
      users:                          [],
      // Show loading spinner 
      fetching_members: false,
      
      // Indicate failure or success of request
      fetched_members_success:        true,

      // Display Current User at top
      current_user:                {username: "DeepakABS"},
                                                    
      // Display 
      members: [],
      selected_member_status: "All",
      member_statuses:        ["All", "Online", "Away", "Offline"],
      test:                   1,
      
      // For setting class
      active_nav:     ""
    }

     // Class binding 
     this.selectMemberToMessage = this.selectMemberToMessage.bind(this);    
     this.selectCurrentUser     = this.selectCurrentUser.bind(this);     

  }

  // Fetch Users in Company
   componentDidMount() {
      // Show loading 
      this.setState({fetching_members: true});

      // Set currentUser 
      this.fetchUsers()
      .then((users) => {

        this.setState({
            test:           3,
            users:        users,
            current_user: users[0]
        })
        
        return this.fetchDirectMessageCountForUser(this.state.current_user)

      })
      .then((user_msg_counts) => {
        this.setState({
            members: user_msg_counts,
            fetching_members: false
        }, () => {
            this.selectMemberToMessage(undefined, this.state.members[0])

          });

      

        // set route

      })
     .catch((err) => {
        this.setState({fetching_members: false, fetched_members_success: false})
      });
  }   


  /*
    @name: fetchUsers
    @descr: Collect all users 
  */  
  fetchUsers(){
    let api     = "/api/getUsers/";

    return fetch(api)
    .then(response => response.json());
  }

  /*
    @name: fetchDirectMessageCountForUser
    @descr: Update state user_msg_counts with users and message counts
 */
  fetchDirectMessageCountForUser(currentUser) {

  // Username
  const username = encodeURIComponent(currentUser.username);

  // Company
  const company = encodeURIComponent(currentUser.company);
    
  let api = "/api/getDirectMessagesCountForUser?username="  + username + "&company=" + company;


  return fetch(api)
  .then(response =>  response.json())

 }

 selectCurrentUser (event) {
  
  // Collect user name
  let username = event.target.value;
  let current_user = {};

  // Modify current user
  this.state.users.forEach((user) => {
                              if (user.username ==  username) 
                                Object.assign(current_user, user);
                          }); 


  // Show loading 
  this.setState({fetching_members: true,
                 current_user: current_user});

  // fetch members for current user
  this.fetchDirectMessageCountForUser(current_user) 
  .then((user_msg_counts) => {
        this.setState({
            members: user_msg_counts,
            fetching_members: false
        }, () => {

           //  Select member to send message
          this.selectMemberToMessage(event, this.state.members[0])
        });

        ;

      })
     .catch((err) => {
        this.setState({fetching_members: false, fetched_members_success: false})
   });
 }

 /*
  
 */
  selectMemberToMessage(event, member) {
    // set member to message
    this.selected_member_to_message = member;

    // Set border 
    
   // Update message with status
   this.setState({
      members: this.state.members.map((el) => (el.username === member.username) ?
                                      Object.assign({}, el, {
                                        isActive: true,
                                       })
                                      : 
                                      Object.assign({}, el, {
                                        isActive: false,
                                       }) )
      }, () =>  // Set the route to 
           this.router.history.push('/directMessage')); 
 
           // Mark messages as read by current_user
           fetch("/api/markMessagesAsRead?receiver_username=" + 
                  this.state.current_user.username + "&sender_username=" + 
                  this.selected_member_to_message.username) 

           // Update new_msg_count
           .then(() => {
             this.setState({
                           members: this.state.members.map((el) => (el.username === this.selected_member_to_message.username) ?
                                      Object.assign({}, el, {
                                        new_msg_count: null,
                                       }) :
                                      Object.assign({}, el, {
                                        new_msg_count: el.new_msg_count,
                                       })
                                      )
                         });
            });
  }
  // Render the Information for each user 
  render() {

    var memberList;
    var mainContent;
    // Spinner
    if(this.state.fetching_members) {
        memberList =  <div  style={{'text-align': 'center'}}> 
                          <i  className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
                     </div>
        console.log("");
    }              

    // Error
    else if (!this.state.fetched_members_success) {
       memberList =  <h4> Unable to get members </h4>;
       memberList +=  <button> Retry </button>;
     }

     else  {
        memberList =  
                          this.state.members.map((member) => 
                            <tr key={member.username} className={member.isActive ? 'active-nav' : 'default-nav'} onClick={(event) => this.selectMemberToMessage(event, member)} >
                              <td> <img src={member.profile_img_url} style={{height:"30px", width:"30px"}}/> </td>
                              <td> {member.name} </td>
                              <td style={{"color": "#FF4081"}}> {member.new_msg_count ? (member.new_msg_count) : '' }  </td>
                              <td> <img src={green_circle}/> </td>
                            </tr>
                        )

     }



    return (
      <BrowserRouter ref={ el => this.router = el }>
      <div className="row">
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--3-col nav">
             
              <div className="direct-messages">
                  <h4 style={{'font-size': '18px', 'background':'none', 'border': 'none'}}> Select User </h4>
              </div>
              <select style={{'background': '#FFF', 'padding': '10px'}} className="mdl-textfield__input" value={this.state.current_user.username} onChange={this.selectCurrentUser}> 
                { this.state.users.map((user) => 
                  <option key={user.username} name={user.username} value={user.username}> {user.name} </option>
                )}
                </select>
              <div className="direct-messages">
                  <h4> Direct Messages </h4>
                  <table  cellspacing="0" cellpadding="0">
                      <tbody>
                       
                        {memberList}
                      </tbody>
                    </table>
              </div>
           </div>

            <div className="mdl-cell mdl-cell--8-col">
                <Route exact path='/directMessage/'  render={(props) => <DirectMessage {...props} current_user =  {this.state.current_user} selected_user={this.selected_member_to_message} />} />;
            </div>
            
           
       </div>   
    </div> 
     </BrowserRouter> 
    );
  }
}


export default App;
