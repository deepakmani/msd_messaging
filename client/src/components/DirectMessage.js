import React, { Component } from 'react';
export class DirectMessage extends Component {
	 constructor() {
        super();

        // Hash dates to display above first message of day to show date is displayed
       this.first_message_dates = {};
       

       this.state = {
       	// Message to send
       	new_message: "",

       	// List of Messages
      	direct_messages: [],
      	messages: [{sender_username: 		"deepakabs",
      				sentAt: 		"Wed Nov 20, 2018 at 11",
      				message: 		"1"
      			  }, 
      			  {sender_username: 		    "deepakabs",
      				senderName:		"Deepak ABS",
      				profile_img_url: "abs",
      				sentAt: 		"Wed Nov 20, 2018 at 11",
      				message: 		"2"
      			  }
      			  ,
      			  {sender_username: 		"deepakabs",
      				senderName:		"Deepak ABS",
      				profile_img_url: "abs",
      				sentAt: 		"Wed Nov 20, 2018 at 11",
      				message: 		"3"
      			  }, 
      			  {sender_username: 		    "deepakabs",
      				senderName:		"Deepak ABS",
      				profile_img_url: "abs",
      				sentAt: 		"Wed Nov 20, 2018 at 11",
      				message: 		"4"
      			  }]
      }		  
        
        // Bind to class         
        this.handleChange = this.handleChange.bind(this);
    	this.send_direct_message = this.send_direct_message.bind(this);       	
    	this.update_first_message_date = this.update_first_message_date.bind(this);
    }

    /* @name:  	update_first_message_date()
		@descr: Show first message with date 
    */
  update_first_message_date(date_str, id) {
   	this.first_message_dates[date_str] = id;

  }
    /* @name:  	componentDidMount()
		@descr: fetch messages between selected user and current user
    */
   componentDidMount() {
      // Show loading 
      this.scrollToBottom();

    //  this.setState({fetching_direct_messages: true});

      // Collect Messages
      this.getDirectMessages(this.props.current_user.username, this.props.selected_user.username)
      

    } 

    /*
    	@name:getDirectMessages
    	@descr: Make GET request to getDirectMessages
    */
  	getDirectMessages(username1, username2) {

		this.first_message_dates = {};
   
	 	this.setState({
            fetching_direct_messages: true
        });
	  let api = "/api/getDirectMessages?username1="  + username1 + "&username2=" + username2;
	  return fetch(api)
	  .then(response =>  response.json())
	  .then((direct_messages) => {


  		// 2. Update firstMessageDay hash
  		let  updated_direct_messages = direct_messages.map((dm) => {
  			let date = new Date(dm.createdAt);	
  			if (!this.first_message_dates[date.toDateString()])
  				this.first_message_dates[date.toDateString()] = dm.id;
  			dm.sent = true;
  			return dm;
  		});

  		// 3.Update state
        this.setState({
            direct_messages:     updated_direct_messages,
            fetching_direct_messages: false
        })
        
      })
	.catch((err) => {
	        this.setState({
	         	//   direct_messages:     updated_direct_messages,
	            fetching_direct_messages: false
	        })
	    })  

  	}

  	componentWillReceiveProps(nextProps) {

		if (nextProps && nextProps.selected_user != undefined &&  nextProps.current_user != undefined) {
			if ((this.props.current_user.username != nextProps.current_user.username) || 
				 (this.props.selected_user.username != nextProps.selected_user.username))
			{
				 // Collect Messages
			     this.getDirectMessages(nextProps.current_user.username, nextProps.selected_user.username)
			     
			}
		}
	  //this.scrollToBottom();
	}
  	componentDidUpdate(prevProps) {
		// if (prevProps && prevProps.selected_user != undefined &&  prevProps.current_user != undefined) {
		// 	if ((this.props.current_user.username != prevProps.current_user.username) || 
		// 		 (this.props.selected_user.username != prevProps.selected_user.username))
		// 	{
		// 		 // Collect Messages
		// 	     this.getDirectMessages(this.props.current_user.username, this.props.selected_user.username)
			     
		// 	}
		// }
	  this.scrollToBottom();
	}


    /* @name: send_direct_message 
       @descr: Send the message to the db and update the status
    */ 
   send_direct_message(event) {
   		event.preventDefault();
    	// 1. Create message object
    	var date 		= new Date();
    	var	date_str 	= date.toDateString();
    	var message 	= this.state.new_message;
        message = message.trim();
        var direct_message = {};
    	if (message) {
    	
    	 	var timestamp 	= date.getTime();
     		  	direct_message = {
                            message:  message,
                            sender_username:   this.props.current_user.username,
                            id:       timestamp + "_" + this.props.current_user.username,   
                            receiver_username: this.props.selected_user.username,

                            // Boolean indicating if message is sent
                            sent:   false,
                           	read: 	false,
                            // Display date for the first message in a day
                            display_date: !(date_str in this.first_message_dates) ? true : false,
                            date_string:  date_str
      		};

      		// Update sent_dates_list
      		if (direct_message.display_date) {
      			this.first_message_dates[date_str] = false;
      		}

      		this.setState({
	    		direct_messages: [...this.state.direct_messages, direct_message],
	    		new_message: 	""
	    	});

      		fetch("/api/sendDirectMessage", {
			  method: 'POST', // or 'PUT'
			  body: JSON.stringify({direct_message: direct_message}),
			  headers: {
                "Content-Type": "application/json"
            	}
			})
			.then((response) =>response.json())
			.then((data) => {

				// If message is delivered
				if (data.sent) {
					// Update message with status
					 this.setState({
					      direct_messages: this.state.direct_messages.map((el) => (el.id === data.id) ?
					      														  Object.assign({}, el, {
					      														  	sent: true,
					      														  	createdAt: data.createdAt
					      														  })
					      														  : el)
					    });	

				}
			})
			// Don't modify the messages
			.catch((err) => {

			})
	    	
	    	// Save the new message in database
      		
      		// Update sent status 
  		}


  }

   /* @name: handleChange: 
      @descr: Update text field when user modifies it
 	*/
 	handleChange(event) {
 	 event.preventDefault();
   	 this.setState({new_message: event.target.value});
  	}	
    // Scroll to bottom
    scrollToBottom = () => {
	  this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	}

	
	render() {

		return (
			<React.Fragment key={this.props.current_user}>

			<div className="direct-message-header">
					<span> Send Message To  {this.props.selected_user.name} </span>
			</div>
			<div className="direct-message-history-wrapper">

				<div className="direct-message-history">
				 	  {!this.state.fetching_direct_messages &&
				 	   <div> 
				 	   	{this.state.direct_messages.map((message) => 
				 		 	<Message key={message.id} message = {message} current_user = {this.props.current_user}  selected_user = {this.props.selected_user} update_first_message_date={this.update_first_message_date} first_message_dates={this.first_message_dates} > </Message>
				 		)}
				 		</div>
				 	}
	
			 		 <div style={{ float:"left", clear: "both" }}
			             ref={(el) => { this.messagesEnd = el; }}>
			       	 </div>
				</div>

				<hr/>


				 <form onSubmit={this.send_direct_message}>
			        <label>

			          <textarea className="send-message-textarea" value={this.state.new_message} onChange={this.handleChange} />
			        </label>
			        <input className="mdl-button mdl-button--primary mdl-button--raised" type="submit" value="Send" />
			      </form>
			</div>
			</React.Fragment>

		)
	}
}

class Message extends Component {
		
	constructor() {
		super();
	}
	render() {
		// Sending / Sent / Seen
		let status = "";
	
		// If message is first
		var firstMessageDate;

		// If message is sent
		if (!this.props.message.sent){
			status = <span style={{color: '#423', float:'right', 'font-size':'10px'}}> Sending... </span>
		}
		
		// If message is sent but unread
		else if(this.props.message.sent && !this.props.message.read) {
			
			// Convert Date to hours minutes
			let date = new Date(this.props.message.createdAt);
				date = date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
			
			status = <span style={{color: '#12B', float:'right', 'font-size':'10px'}}> Sent at {date} </span>
		}

		else if(this.props.message.sent && this.props.message.read) {

			let date = new Date(this.props.message.updatedAt);
				date = date.toLocaleTimeString();
			status = <span style={{color: '#090', float:'right', 'font-size':'10px'}}> Seen at {date} </span>
		}

		// Display Date for First Message of Day
		let date_str = this.props.message.date_string ? this.props.message.date_string : new Date(this.props.message.createdAt).toDateString();


		if (this.props.message.display_date && this.props.first_message_dates[date_str] == false && !this.props.message.sent) {
			firstMessageDate =   <div style={{"text-align": 'center', 'font-size':'15px'}}> {date_str} </div>;

			this.props.update_first_message_date(date_str, this.props.message.id);
		}
		if (this.props.message.sent && this.props.first_message_dates[date_str] ==  this.props.message.id) {

			firstMessageDate = <div style={{"text-align": 'center', 'font-size':'15px'}}> {date_str} </div>;
		}

	 	if (this.props.current_user.username == this.props.message.sender_username) {

		return (
				// If message is sent by user style it differently
				<React.Fragment>
				{firstMessageDate}
				<br/>
				<ul className="sent-message-ul">
					<li>
						{this.props.current_user.profile_image_url}
						<br/>
						You
					</li>
					<li> 
						<span className="sent-message">
							{this.props.message.message}
						</span>
						<br/>
						<br/>

						{status}
					</li>
				
				</ul>		
				</React.Fragment>
				
	 		)
		}

		if (this.props.selected_user.username == this.props.message.sender_username) {

		return (
				// If message is sent by user style it differently
				<React.Fragment>
				{firstMessageDate}
				<br/>
				<ul className="received-message-ul">
					<li>
						<img style={{height:"30px", width:"30px"}} src={this.props.selected_user.profile_img_url}/>
						<br/>
						{this.props.selected_user.name}
					</li>
					<li> 
						<span className="sent-message">
							{this.props.message.message}
						</span>
						<br/>
						<br/>
						{status}
					</li>
					
				</ul>		
				</React.Fragment>
				
	 		)
		}
	
	}	
}



