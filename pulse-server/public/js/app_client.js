
let bootstrapper = function() {
    
    // get the dom elements that will be accessed or manipulated
    let id_main_content = '#main-content';
    let id_search_box = '#search-box';
    let id_search_form = '#search-form';
    let id_word_placeholder = '#word-placeholder';
    let id_meaning_placeholder = '#meaning-placeholder';
    let id_suggestion_container = '#suggestion-container';
    let id_login_button = '#btn-login';
    let id_logout_button = '#btn-logout';    
    let id_register_button = '#btn-register';
    let id_add_word_button = '#btn-add-word';
    let id_edit_meaning_button = '#btn-edit-meaning';
    let id_hidden_username = '#hidden-user-name';
    let id_current_username = '#current-user-name';
    let id_token = '#token';
    let id_auth_msg_container = '#auth-err-container';  
    let id_auth_err_alert = '#auth-err-alert';        
    let id_btn_home = '#btn-home';
    let use_local_storage = true;


    let save_session = function(session) {

        if(use_local_storage) {
            localStorage.setItem("token", session.token);
            localStorage.setItem("username", session.username);
        } else {
            $(id_token).val(session.token);
            $(id_hidden_username).val(session.username);
        }
        $(id_current_username).text(session.username);

    };

    let get_token = function() {
        
        if(use_local_storage) {
            return localStorage.getItem("token");
        } else {
            return $(id_token).val();
        }

    };

    let get_username = function() {

        if(use_local_storage) {
            // set default, if not found
            if(!localStorage.getItem('username')) {
                localStorage.setItem('username', 'Guest User');
            }
            return localStorage.getItem("username");
        } else {
            return $(id_hidden_username).val();
        }

    };    

    // a function to return to home
    let get_home_page = function() {

        $.get('/user/home', function(data) {
            $(id_main_content).html(data);
            attach_home_listeners();
        });        

    };

    // return to home, when main title gets clicked
    $(id_btn_home).click(function(event) {

        event.preventDefault();
        get_home_page();

    });

    // asynchronously search for a word
    // in dictionary sitting on a server
    let ajax_search = function(options) {

        options.is_textarea_content = options.is_textarea_content || false;

        $.get(`/dictionary/dictionary?word=${ options.search_key }`, function(data) {

            if(data.meaning) {

                $(id_search_box).val(options.search_key);

                $(id_suggestion_container).hide();
                if(!options.is_textarea_content) {
                    // prepare result
                    $('#word').text(options.search_key);
                    let definitions = data.meaning.split(';');
                    let def_list = '';
                    for(let i = 0; i < definitions.length; i+=1) {
                        def_list += `<li> ${ definitions[i] } </li>`;
                    }      
                    $('#meaning').html(def_list);              
                } else {
                    $('#meaning').val(data.meaning);
                }
                
            } else {
                $('#word').text(options.search_key);
                $('#meaning').html('<i>Word NOT FOUND in dictionary!</i>');
            }

        });

    };

    let get_suggestion = function(search_key) {

        
        // just fetch suggestions
        $.get(`/dictionary/suggestion?word=${ search_key }`, function(data) {

            if(data.suggestion) {
                
                $(id_suggestion_container).show();
                $(id_suggestion_container).html(data.suggestion);
                
                // manage the mouse hover state of the suggestion container
                $(id_suggestion_container).data('moused', 'out');             
    
                $('.suggestion-item').click(function() {
                    ajax_search({search_key : $(this).text().trim()});
                });    
                
                $('.suggestion-item').mouseover(function() {
                    $('.suggestion-item').css('background-color', 'white');
                    $(this).css('background-color', '#E0E0E0');
                });                     

            } else {
                
                $(id_suggestion_container).hide();

            }
            
        });

    };

    let attach_home_listeners = function() {

        let cur_suggestion_index = -1;

         // send a search request when go button is clicked
        $(id_search_box).keyup(function(event) {
            // hide auth-error in case
            let search_key = $(id_search_box).val();
    
            if($(id_suggestion_container).is(':visible')) {

                let num_sugg = $(`${id_suggestion_container} ul`).data('num_sugg');

                if(event.which === 38 || event.which === 40) {

                    if(event.which === 38) {
                        // up arrow
                        if(cur_suggestion_index <= 0) {
                            cur_suggestion_index = num_sugg - 1;
                        } else {
                            cur_suggestion_index--;                                                    
                        }
                    } else {
                        // down arrow
                        cur_suggestion_index++; 
                    }

                    cur_suggestion_index = cur_suggestion_index % num_sugg;
                    $('.suggestion-item').css('background-color', 'white'); 
                    $(`#order-${ cur_suggestion_index }`).css('background-color', '#E0E0E0'); 

                    /*
                    // put the cursor at the end
                    let box = document.getElementById("search-box");
                    let sel_index = $(id_search_box).val().length;
                    box.setSelectionRange(sel_index, sel_index);
                    */
                    
                    return;

                } else if(event.which !== 13) {
                    cur_suggestion_index = -1;
                }

            } else {
                cur_suggestion_index = -1;
            }

            // check for enter key event
            if(event.which === 13) {
    
                if(cur_suggestion_index !== -1) {
                    search_key = $(`#order-${ cur_suggestion_index }`).text().trim();
                }
                // enter is clicked, so fetch definition
                $(id_suggestion_container).hide();
                ajax_search({search_key: search_key});
    
            } else {
                get_suggestion(search_key);
            }
    
        });
   
        $(id_search_box).keydown(function(event) {
            if(event.which === 38 || event.which === 40) {
                event.preventDefault();                
            }
        });

        // when search box loses focus, hide the suggestions
        $(id_search_box).focusout(function(event) {
            if($(id_suggestion_container).data('moused') === 'out') {
                $(id_suggestion_container).hide();     
            } 
                               
        });    
    
        $(id_suggestion_container).mouseenter(function() {
            $(this).data('moused', 'in');
        });
    
        $(id_suggestion_container).mouseleave(function() {
            $(this).data('moused', 'out');
        });   
    
        // when search box gains focus, show the suggestions
        $(id_search_box).focusin(function(event) {
            // remove alert, if there is one
            $(id_auth_err_alert).remove()
            get_suggestion($(id_search_box).val());                      
        });      
    
        // prevent the form from submitting
        $(id_search_form).submit(function() {    
            return false;
        });

        // update the currently logged-in user's username
        $(id_current_username).text(get_username());
        
        // display the appropriate buttons, depending
        // on the type of the user
        if(get_username() == 'Guest User') {
    
            $(id_logout_button).hide();    
            $(id_login_button).show();
            $(id_register_button).show();
            
        } else {
            $(id_logout_button).show();    
            $(id_login_button).hide();
            $(id_register_button).hide();
        }        

    };
    
    // function that attaches click listener
    // to the registration-form's submit button
    let attachClickListenerToRegisterSubmit = function() {
    
        $('#btn-register-submit').click(function() {
            
            // send username, and password, and display resp message
            ajax_authenticate('/user/register');    

            return false;

        });        
    
        
    };
    
    // when register button is clicked, 
    // serve the registration form
    $(id_register_button).click(function(){
        // remove alert, if there is one
        $(id_auth_err_alert).remove()
        // get the register form
        $.get('/user/register-form', function(data) {
            
            // display the form
            $(id_main_content).html(data);
            attachClickListenerToRegisterSubmit();

        });     
        
    });
    
    let ajax_authenticate = function(url) {

        let username = $('#username').val();
        let password = $('#password').val();

        // do basic client-side validation
        if(username === '' || password === '') {
            $('form').addClass('was-validated');
            return;
        }

        $.post(

            url, 

            {
                username: username,
                password: password
            }
            , 

            function(data, status, xhr) {
                
                if(data.success) {

                    // display the success message
                    $(id_auth_msg_container).html(data.message);                  
                    // extract the token from the request header
                    let token = xhr.getResponseHeader('authorization').split(' ')[1];
                    // set session
                    save_session({token: token, username: data.username});
                    // now redirect to the home page
                    get_home_page();

                } else {
                    // display error message
                    $('#msg-container').html(data.message);                        
                }

            }
        );      

    };

    // function that attaches click listener
    // to the login-form's submit button
    let attachClickListenerToLoginSubmit = function() {
        
        // when form's submit button is clicked,
        // try to add word asynchronously
        $('#btn-login-submit').click(function(event) {
                        
            // send the updated meaning, and display
            // the response message
            ajax_authenticate('/user/login');    

            return false;
    
        });        
        
    };

    let get_login_form = function() {
        // get the login form
        $.get('/user/login-form', function(data) {

            // display the form
            $(id_main_content).html(data);
            attachClickListenerToLoginSubmit();

        });    

    }
    // when login button is clicked, 
    // serve the login form
    $(id_login_button).click(function(){

        // remove alert, if there is one
        $(id_auth_err_alert).remove() 
        get_login_form();

    });

    // when login button is clicked, 
    // serve the login form
    $(id_logout_button).click(function(){
        
        // remove alert, if there is one
        $(id_auth_err_alert).remove()
        
        // reset the token, and the username
        save_session({token: '', username: 'Guest User'});
        $(id_logout_button).hide();
        $(id_login_button).show();
        $(id_register_button).show();

        // and return to home page
        get_home_page();
        
    });    

    let get_dictionary_form = function(url, success_fun) {

        $.get({

            url: url,
            headers: { 'Authorization': `Bearer ${ get_token() }`},
            success: function(data) {
                
                // data.error being true tells us that
                // the form is not fetched, and that
                // only an error message is sent back.
                if(data.error) {

                    // show authentication error
                    $(id_auth_msg_container).html(data.error);
                    get_login_form();

                } else {

                    // display the form
                    $(id_main_content).html(data.form);
                    success_fun();
                }

            }                
        });     

    };    
    
    let attach_dic_submit_listener = function(url) {

        $('#btn-dic-submit').click(function() {
            
            // get the word and meaning values
            let word = $('#word').val();
            let meaning = $('#meaning').val();

            // do basic client-side validation
            if(word === '' || meaning === '') {
                $('form').addClass('was-validated');
                return false;
            }            

            let query_string = `${ url }?word=${ word }&meaning=${ meaning }`;
            
            // send the updated meaning, and display
            // the response message
            $.get(query_string, function(data) {
                $('#msg-container').html(data.message);
                $('#msg-container').show();
            });      

            return false;
    
        });

        $('#word').focusin(function(event) {
            // hide the edit message as the word
            // is being modified ...
            $('#msg-container').hide();
        });            

    };

    // function that attaches click listener
    // to the addword-form's submit button
    let attachClickListenerToAddwordForm = function() {
    
        // when form's submit button is clicked,
        // try to add word asynchronously
        attach_dic_submit_listener('/dictionary/addword');      
    
    };

    // when add-word button is clicked, 
    // serve the add word form
    $(id_add_word_button).click( function(){

        let get_url = '/dictionary/addword-form';    
        get_dictionary_form(get_url, attachClickListenerToAddwordForm);
        
    });
    
    // function that attaches click listener
    // to the edit-meaning-form's submit button
    let attachClickListenersToEditMeaningForm = function() {

        // when form's submit button is clicked,
        // try to add word asynchronously
        attach_dic_submit_listener('/dictionary/edit-meaning');

        // send a search request when go button is clicked
        $('#word').keyup(function(event) {

            let search_key = $(this).val();

            // asynchronously fetch, and update the meaning
            // in the definition box
            $.get(`/dictionary/dictionary?word=${ search_key }`, function(data) {

                if(data.meaning) {
                    $('#meaning').val(data.meaning);
                } else {
                    // setting the textarea to empty string,
                    // will force bring up the default placeholder
                    $('#meaning').val('');
                }

            });

        });        
    
    };
    
    // when edit-meaning button is clicked, 
    // serve the edit-meaning form
    $(id_edit_meaning_button).click(function(){

        let get_url = '/dictionary/edit-meaning-form';
        get_dictionary_form(get_url, attachClickListenersToEditMeaningForm);      
        
    });
    
    // yes do attach home listeners, since
    // this is a first time home setup
    attach_home_listeners();

};
    
// bootstrap your app
bootstrapper();
