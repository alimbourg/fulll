import React, { Component, Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// An all in one sample application for the 5 checkboxes and github autocompletion
class Checkboxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: [false, false, false, false]
        }
    }
    //onClick = e => {}
    onChangeAll = (e) => {
        const { selection } = this.state;
        console.log(e.target.checked);
        const isChecked = (e.target.checked);
        // let newSelection = [...selection];
        this.setState({selection:[isChecked, isChecked, isChecked, isChecked] })
    }

    onChange = (e) => {
        const { selection } = this.state;
        //const changeId = e.target.attributes.getNamedItem("id").value; //"data-remove").value
        const removeId = parseInt(e.target.attributes.getNamedItem("data-index").value, 10); //"data-remove").value
        console.log(removeId);
        let newSelection = [...selection];
        newSelection[removeId] = !newSelection[removeId];
        this.setState({ selection: newSelection })
    }

    render() {
        const { onChangeAll, onChange, state: { selection } } = this;
        const selectAll = selection.every((elt)=>elt);
        return (
            <Fragment>
                <fieldset>
                    <input type="checkbox" id="all" data-index="all" checked={selectAll} onChange={onChangeAll}></input>
                    <label htmlFor="all">Select All</label>
                    <input type="checkbox" id="uno" data-index="0" checked={selection[0]} onChange={onChange}></input>
                    <label htmlFor="uno">Uno</label>
                    <input type="checkbox" id="duo" data-index="1" checked={selection[1]} onChange={onChange}></input>
                    <label htmlFor="duo">Duo</label>
                    <input type="checkbox" id="tre" data-index="2" checked={selection[2]} onChange={onChange}></input>
                    <label htmlFor="tre">Tre</label>
                    <input type="checkbox" id="quatro" data-index="3" checked={selection[3]} onChange={onChange}></input>
                    <label htmlFor="quatro">Quatro</label>
                </fieldset>
            </Fragment>
        );
    }
}
// Small mockup component to show autosuggestions from an ajax call
class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: "",
            errorStatus: ""
        };
        this.activeRef = React.createRef(); // internal to allow scrolling into view
    }

    onChange = e => {
        const userInput = e.currentTarget.value;
        let promise = null;
        const useGithubSample = false;
        // damn Promises, so many conventions
        if (useGithubSample) {
            promise = new Promise((resolve, reject) => {
                let data = JSON.parse(githubSample);
                resolve(data);
            });
        } else {
            promise = fetch("https://api.github.com/search/users?q={USER}".replace('{USER}', userInput.toLowerCase()))
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error('invalid status '+res.status);
                    }
                    return res.json();
                });
        }
        promise.then((res) => res.items.map((item) => { return { login: item.login, avatar_url: item.avatar_url }; }))
           //.catch((error) => {
           // return Promise.resolve(['AWEN', 'JULIE', 'ABRACADABRA', 'ABCDEFGHIJKLMONOPQRSTUVWXYZ']);
           //})
           .then((result) => {
               return result.filter(suggestion =>
                   suggestion.login.toLowerCase().indexOf(userInput.toLowerCase()) > -1
                );
           })
            .then((result) => {
                this.setState({
                    activeSuggestion: 0,
                    filteredSuggestions: result,
                    showSuggestions: true,
                    userInput: userInput,
                    errorStatus: "",
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    errorStatus: error.toString(),
                    activeSuggestion: 0,
                    filteredSuggestions: [],
                    showSuggestions: false,
                    userInput: userInput,
                });
            })
    };

    onClick = e => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;
        // enter
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion].login
            });
        } else if (e.keyCode === 38) { // up arrow
            if (activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
            if ((this.activeRef)&&(this.activeRef.current)) {
                this.activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
            if (activeSuggestion >= filteredSuggestions.length-1) {
                this.setState({ activeSuggestion: 0 });
            } else {
                this.setState({ activeSuggestion: activeSuggestion + 1 });
            }
            if ((this.activeRef) && (this.activeRef.current)) {
                this.activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput,
                errorStatus
            }
        } = this;

        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                let activeRef = null;
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;
                            // Flag the active suggestion with a class
                            // for conditional attributes
                            const spreadedAttrs = {};
                            if (index === activeSuggestion) {
                                className = "active";
                                spreadedAttrs.ref = this.activeRef;
                            }

                            return (
                                <li {...spreadedAttrs} className={className} key={suggestion.login} onClick={onClick}>
                                    <img src={suggestion.avatar_url} />
                                    {suggestion.login}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>No suggestions available.</em>
                    </div>
                );
            }
        }

        return (
            <Fragment>
                <input
                    type="text"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                    className="github"
                />
                {suggestionsListComponent}
                <p><small>{errorStatus}</small></p>
            </Fragment>
        );
    }
}
//export default Autocomplete;

function App() {
    // Create the count state.
    const [count, setCount] = useState(0);
    // Update the count (+1 every second).
    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000);
        return () => clearTimeout(timer);
    }, [count, setCount]);
    // Return the App component.
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Page has been open for <code>{count}</code> seconds.
                </p>
            </header>
            <Autocomplete />
            <Checkboxes />
        </div>
    );
}

export default App;


//import App from './App.jsx';
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode >,
    document.getElementById('root'),
);




const githubSample = `
{
    "total_count": 104225,
        "incomplete_results": false,
            "items": [
                {
                    "login": "e",
                    "id": 4753511,
                    "node_id": "MDQ6VXNlcjQ3NTM1MTE=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/4753511?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/e",
                    "html_url": "https://github.com/e",
                    "followers_url": "https://api.github.com/users/e/followers",
                    "following_url": "https://api.github.com/users/e/following{/other_user}",
                    "gists_url": "https://api.github.com/users/e/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/e/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/e/subscriptions",
                    "organizations_url": "https://api.github.com/users/e/orgs",
                    "repos_url": "https://api.github.com/users/e/repos",
                    "events_url": "https://api.github.com/users/e/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/e/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "Eycore",
                    "id": 55470681,
                    "node_id": "MDQ6VXNlcjU1NDcwNjgx",
                    "avatar_url": "https://avatars.githubusercontent.com/u/55470681?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/Eycore",
                    "html_url": "https://github.com/Eycore",
                    "followers_url": "https://api.github.com/users/Eycore/followers",
                    "following_url": "https://api.github.com/users/Eycore/following{/other_user}",
                    "gists_url": "https://api.github.com/users/Eycore/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/Eycore/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/Eycore/subscriptions",
                    "organizations_url": "https://api.github.com/users/Eycore/orgs",
                    "repos_url": "https://api.github.com/users/Eycore/repos",
                    "events_url": "https://api.github.com/users/Eycore/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/Eycore/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "darkstiffler",
                    "id": 3029440,
                    "node_id": "MDQ6VXNlcjMwMjk0NDA=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/3029440?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/darkstiffler",
                    "html_url": "https://github.com/darkstiffler",
                    "followers_url": "https://api.github.com/users/darkstiffler/followers",
                    "following_url": "https://api.github.com/users/darkstiffler/following{/other_user}",
                    "gists_url": "https://api.github.com/users/darkstiffler/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/darkstiffler/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/darkstiffler/subscriptions",
                    "organizations_url": "https://api.github.com/users/darkstiffler/orgs",
                    "repos_url": "https://api.github.com/users/darkstiffler/repos",
                    "events_url": "https://api.github.com/users/darkstiffler/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/darkstiffler/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "esirplayground",
                    "id": 50467624,
                    "node_id": "MDQ6VXNlcjUwNDY3NjI0",
                    "avatar_url": "https://avatars.githubusercontent.com/u/50467624?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/esirplayground",
                    "html_url": "https://github.com/esirplayground",
                    "followers_url": "https://api.github.com/users/esirplayground/followers",
                    "following_url": "https://api.github.com/users/esirplayground/following{/other_user}",
                    "gists_url": "https://api.github.com/users/esirplayground/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/esirplayground/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/esirplayground/subscriptions",
                    "organizations_url": "https://api.github.com/users/esirplayground/orgs",
                    "repos_url": "https://api.github.com/users/esirplayground/repos",
                    "events_url": "https://api.github.com/users/esirplayground/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/esirplayground/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "appositum",
                    "id": 21044944,
                    "node_id": "MDQ6VXNlcjIxMDQ0OTQ0",
                    "avatar_url": "https://avatars.githubusercontent.com/u/21044944?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/appositum",
                    "html_url": "https://github.com/appositum",
                    "followers_url": "https://api.github.com/users/appositum/followers",
                    "following_url": "https://api.github.com/users/appositum/following{/other_user}",
                    "gists_url": "https://api.github.com/users/appositum/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/appositum/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/appositum/subscriptions",
                    "organizations_url": "https://api.github.com/users/appositum/orgs",
                    "repos_url": "https://api.github.com/users/appositum/repos",
                    "events_url": "https://api.github.com/users/appositum/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/appositum/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "edunham",
                    "id": 812892,
                    "node_id": "MDQ6VXNlcjgxMjg5Mg==",
                    "avatar_url": "https://avatars.githubusercontent.com/u/812892?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/edunham",
                    "html_url": "https://github.com/edunham",
                    "followers_url": "https://api.github.com/users/edunham/followers",
                    "following_url": "https://api.github.com/users/edunham/following{/other_user}",
                    "gists_url": "https://api.github.com/users/edunham/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/edunham/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/edunham/subscriptions",
                    "organizations_url": "https://api.github.com/users/edunham/orgs",
                    "repos_url": "https://api.github.com/users/edunham/repos",
                    "events_url": "https://api.github.com/users/edunham/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/edunham/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "gabelula",
                    "id": 28330,
                    "node_id": "MDQ6VXNlcjI4MzMw",
                    "avatar_url": "https://avatars.githubusercontent.com/u/28330?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/gabelula",
                    "html_url": "https://github.com/gabelula",
                    "followers_url": "https://api.github.com/users/gabelula/followers",
                    "following_url": "https://api.github.com/users/gabelula/following{/other_user}",
                    "gists_url": "https://api.github.com/users/gabelula/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/gabelula/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/gabelula/subscriptions",
                    "organizations_url": "https://api.github.com/users/gabelula/orgs",
                    "repos_url": "https://api.github.com/users/gabelula/repos",
                    "events_url": "https://api.github.com/users/gabelula/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/gabelula/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "emaraschio",
                    "id": 988715,
                    "node_id": "MDQ6VXNlcjk4ODcxNQ==",
                    "avatar_url": "https://avatars.githubusercontent.com/u/988715?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/emaraschio",
                    "html_url": "https://github.com/emaraschio",
                    "followers_url": "https://api.github.com/users/emaraschio/followers",
                    "following_url": "https://api.github.com/users/emaraschio/following{/other_user}",
                    "gists_url": "https://api.github.com/users/emaraschio/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/emaraschio/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/emaraschio/subscriptions",
                    "organizations_url": "https://api.github.com/users/emaraschio/orgs",
                    "repos_url": "https://api.github.com/users/emaraschio/repos",
                    "events_url": "https://api.github.com/users/emaraschio/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/emaraschio/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "eculver",
                    "id": 40828,
                    "node_id": "MDQ6VXNlcjQwODI4",
                    "avatar_url": "https://avatars.githubusercontent.com/u/40828?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/eculver",
                    "html_url": "https://github.com/eculver",
                    "followers_url": "https://api.github.com/users/eculver/followers",
                    "following_url": "https://api.github.com/users/eculver/following{/other_user}",
                    "gists_url": "https://api.github.com/users/eculver/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/eculver/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/eculver/subscriptions",
                    "organizations_url": "https://api.github.com/users/eculver/orgs",
                    "repos_url": "https://api.github.com/users/eculver/repos",
                    "events_url": "https://api.github.com/users/eculver/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/eculver/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "Bumblefuck",
                    "id": 17867923,
                    "node_id": "MDQ6VXNlcjE3ODY3OTIz",
                    "avatar_url": "https://avatars.githubusercontent.com/u/17867923?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/Bumblefuck",
                    "html_url": "https://github.com/Bumblefuck",
                    "followers_url": "https://api.github.com/users/Bumblefuck/followers",
                    "following_url": "https://api.github.com/users/Bumblefuck/following{/other_user}",
                    "gists_url": "https://api.github.com/users/Bumblefuck/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/Bumblefuck/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/Bumblefuck/subscriptions",
                    "organizations_url": "https://api.github.com/users/Bumblefuck/orgs",
                    "repos_url": "https://api.github.com/users/Bumblefuck/repos",
                    "events_url": "https://api.github.com/users/Bumblefuck/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/Bumblefuck/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "elifoster",
                    "id": 4176124,
                    "node_id": "MDQ6VXNlcjQxNzYxMjQ=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/4176124?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/elifoster",
                    "html_url": "https://github.com/elifoster",
                    "followers_url": "https://api.github.com/users/elifoster/followers",
                    "following_url": "https://api.github.com/users/elifoster/following{/other_user}",
                    "gists_url": "https://api.github.com/users/elifoster/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/elifoster/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/elifoster/subscriptions",
                    "organizations_url": "https://api.github.com/users/elifoster/orgs",
                    "repos_url": "https://api.github.com/users/elifoster/repos",
                    "events_url": "https://api.github.com/users/elifoster/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/elifoster/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "lefant",
                    "id": 64208,
                    "node_id": "MDQ6VXNlcjY0MjA4",
                    "avatar_url": "https://avatars.githubusercontent.com/u/64208?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/lefant",
                    "html_url": "https://github.com/lefant",
                    "followers_url": "https://api.github.com/users/lefant/followers",
                    "following_url": "https://api.github.com/users/lefant/following{/other_user}",
                    "gists_url": "https://api.github.com/users/lefant/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/lefant/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/lefant/subscriptions",
                    "organizations_url": "https://api.github.com/users/lefant/orgs",
                    "repos_url": "https://api.github.com/users/lefant/repos",
                    "events_url": "https://api.github.com/users/lefant/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/lefant/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "ejgallego",
                    "id": 7192257,
                    "node_id": "MDQ6VXNlcjcxOTIyNTc=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/7192257?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/ejgallego",
                    "html_url": "https://github.com/ejgallego",
                    "followers_url": "https://api.github.com/users/ejgallego/followers",
                    "following_url": "https://api.github.com/users/ejgallego/following{/other_user}",
                    "gists_url": "https://api.github.com/users/ejgallego/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/ejgallego/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/ejgallego/subscriptions",
                    "organizations_url": "https://api.github.com/users/ejgallego/orgs",
                    "repos_url": "https://api.github.com/users/ejgallego/repos",
                    "events_url": "https://api.github.com/users/ejgallego/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/ejgallego/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "bcoe",
                    "id": 194609,
                    "node_id": "MDQ6VXNlcjE5NDYwOQ==",
                    "avatar_url": "https://avatars.githubusercontent.com/u/194609?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/bcoe",
                    "html_url": "https://github.com/bcoe",
                    "followers_url": "https://api.github.com/users/bcoe/followers",
                    "following_url": "https://api.github.com/users/bcoe/following{/other_user}",
                    "gists_url": "https://api.github.com/users/bcoe/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/bcoe/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/bcoe/subscriptions",
                    "organizations_url": "https://api.github.com/users/bcoe/orgs",
                    "repos_url": "https://api.github.com/users/bcoe/repos",
                    "events_url": "https://api.github.com/users/bcoe/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/bcoe/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "ebukahills",
                    "id": 21314258,
                    "node_id": "MDQ6VXNlcjIxMzE0MjU4",
                    "avatar_url": "https://avatars.githubusercontent.com/u/21314258?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/ebukahills",
                    "html_url": "https://github.com/ebukahills",
                    "followers_url": "https://api.github.com/users/ebukahills/followers",
                    "following_url": "https://api.github.com/users/ebukahills/following{/other_user}",
                    "gists_url": "https://api.github.com/users/ebukahills/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/ebukahills/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/ebukahills/subscriptions",
                    "organizations_url": "https://api.github.com/users/ebukahills/orgs",
                    "repos_url": "https://api.github.com/users/ebukahills/repos",
                    "events_url": "https://api.github.com/users/ebukahills/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/ebukahills/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "erycsilva",
                    "id": 15589410,
                    "node_id": "MDQ6VXNlcjE1NTg5NDEw",
                    "avatar_url": "https://avatars.githubusercontent.com/u/15589410?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/erycsilva",
                    "html_url": "https://github.com/erycsilva",
                    "followers_url": "https://api.github.com/users/erycsilva/followers",
                    "following_url": "https://api.github.com/users/erycsilva/following{/other_user}",
                    "gists_url": "https://api.github.com/users/erycsilva/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/erycsilva/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/erycsilva/subscriptions",
                    "organizations_url": "https://api.github.com/users/erycsilva/orgs",
                    "repos_url": "https://api.github.com/users/erycsilva/repos",
                    "events_url": "https://api.github.com/users/erycsilva/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/erycsilva/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "tuteng",
                    "id": 1907867,
                    "node_id": "MDQ6VXNlcjE5MDc4Njc=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/1907867?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/tuteng",
                    "html_url": "https://github.com/tuteng",
                    "followers_url": "https://api.github.com/users/tuteng/followers",
                    "following_url": "https://api.github.com/users/tuteng/following{/other_user}",
                    "gists_url": "https://api.github.com/users/tuteng/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/tuteng/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/tuteng/subscriptions",
                    "organizations_url": "https://api.github.com/users/tuteng/orgs",
                    "repos_url": "https://api.github.com/users/tuteng/repos",
                    "events_url": "https://api.github.com/users/tuteng/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/tuteng/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "fukamachi",
                    "id": 90570,
                    "node_id": "MDQ6VXNlcjkwNTcw",
                    "avatar_url": "https://avatars.githubusercontent.com/u/90570?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/fukamachi",
                    "html_url": "https://github.com/fukamachi",
                    "followers_url": "https://api.github.com/users/fukamachi/followers",
                    "following_url": "https://api.github.com/users/fukamachi/following{/other_user}",
                    "gists_url": "https://api.github.com/users/fukamachi/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/fukamachi/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/fukamachi/subscriptions",
                    "organizations_url": "https://api.github.com/users/fukamachi/orgs",
                    "repos_url": "https://api.github.com/users/fukamachi/repos",
                    "events_url": "https://api.github.com/users/fukamachi/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/fukamachi/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "coord-e",
                    "id": 16184855,
                    "node_id": "MDQ6VXNlcjE2MTg0ODU1",
                    "avatar_url": "https://avatars.githubusercontent.com/u/16184855?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/coord-e",
                    "html_url": "https://github.com/coord-e",
                    "followers_url": "https://api.github.com/users/coord-e/followers",
                    "following_url": "https://api.github.com/users/coord-e/following{/other_user}",
                    "gists_url": "https://api.github.com/users/coord-e/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/coord-e/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/coord-e/subscriptions",
                    "organizations_url": "https://api.github.com/users/coord-e/orgs",
                    "repos_url": "https://api.github.com/users/coord-e/repos",
                    "events_url": "https://api.github.com/users/coord-e/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/coord-e/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "eduardostuart",
                    "id": 767879,
                    "node_id": "MDQ6VXNlcjc2Nzg3OQ==",
                    "avatar_url": "https://avatars.githubusercontent.com/u/767879?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/eduardostuart",
                    "html_url": "https://github.com/eduardostuart",
                    "followers_url": "https://api.github.com/users/eduardostuart/followers",
                    "following_url": "https://api.github.com/users/eduardostuart/following{/other_user}",
                    "gists_url": "https://api.github.com/users/eduardostuart/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/eduardostuart/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/eduardostuart/subscriptions",
                    "organizations_url": "https://api.github.com/users/eduardostuart/orgs",
                    "repos_url": "https://api.github.com/users/eduardostuart/repos",
                    "events_url": "https://api.github.com/users/eduardostuart/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/eduardostuart/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "rafaballerini",
                    "id": 54322854,
                    "node_id": "MDQ6VXNlcjU0MzIyODU0",
                    "avatar_url": "https://avatars.githubusercontent.com/u/54322854?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/rafaballerini",
                    "html_url": "https://github.com/rafaballerini",
                    "followers_url": "https://api.github.com/users/rafaballerini/followers",
                    "following_url": "https://api.github.com/users/rafaballerini/following{/other_user}",
                    "gists_url": "https://api.github.com/users/rafaballerini/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/rafaballerini/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/rafaballerini/subscriptions",
                    "organizations_url": "https://api.github.com/users/rafaballerini/orgs",
                    "repos_url": "https://api.github.com/users/rafaballerini/repos",
                    "events_url": "https://api.github.com/users/rafaballerini/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/rafaballerini/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "laymonage",
                    "id": 6379424,
                    "node_id": "MDQ6VXNlcjYzNzk0MjQ=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/6379424?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/laymonage",
                    "html_url": "https://github.com/laymonage",
                    "followers_url": "https://api.github.com/users/laymonage/followers",
                    "following_url": "https://api.github.com/users/laymonage/following{/other_user}",
                    "gists_url": "https://api.github.com/users/laymonage/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/laymonage/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/laymonage/subscriptions",
                    "organizations_url": "https://api.github.com/users/laymonage/orgs",
                    "repos_url": "https://api.github.com/users/laymonage/repos",
                    "events_url": "https://api.github.com/users/laymonage/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/laymonage/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "eyantra",
                    "id": 4485688,
                    "node_id": "MDQ6VXNlcjQ0ODU2ODg=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/4485688?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/eyantra",
                    "html_url": "https://github.com/eyantra",
                    "followers_url": "https://api.github.com/users/eyantra/followers",
                    "following_url": "https://api.github.com/users/eyantra/following{/other_user}",
                    "gists_url": "https://api.github.com/users/eyantra/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/eyantra/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/eyantra/subscriptions",
                    "organizations_url": "https://api.github.com/users/eyantra/orgs",
                    "repos_url": "https://api.github.com/users/eyantra/repos",
                    "events_url": "https://api.github.com/users/eyantra/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/eyantra/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "EBWi11",
                    "id": 20244029,
                    "node_id": "MDQ6VXNlcjIwMjQ0MDI5",
                    "avatar_url": "https://avatars.githubusercontent.com/u/20244029?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/EBWi11",
                    "html_url": "https://github.com/EBWi11",
                    "followers_url": "https://api.github.com/users/EBWi11/followers",
                    "following_url": "https://api.github.com/users/EBWi11/following{/other_user}",
                    "gists_url": "https://api.github.com/users/EBWi11/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/EBWi11/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/EBWi11/subscriptions",
                    "organizations_url": "https://api.github.com/users/EBWi11/orgs",
                    "repos_url": "https://api.github.com/users/EBWi11/repos",
                    "events_url": "https://api.github.com/users/EBWi11/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/EBWi11/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "pemami4911",
                    "id": 6277085,
                    "node_id": "MDQ6VXNlcjYyNzcwODU=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/6277085?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/pemami4911",
                    "html_url": "https://github.com/pemami4911",
                    "followers_url": "https://api.github.com/users/pemami4911/followers",
                    "following_url": "https://api.github.com/users/pemami4911/following{/other_user}",
                    "gists_url": "https://api.github.com/users/pemami4911/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/pemami4911/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/pemami4911/subscriptions",
                    "organizations_url": "https://api.github.com/users/pemami4911/orgs",
                    "repos_url": "https://api.github.com/users/pemami4911/repos",
                    "events_url": "https://api.github.com/users/pemami4911/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/pemami4911/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "Emmanuella-Aninye",
                    "id": 23155048,
                    "node_id": "MDQ6VXNlcjIzMTU1MDQ4",
                    "avatar_url": "https://avatars.githubusercontent.com/u/23155048?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/Emmanuella-Aninye",
                    "html_url": "https://github.com/Emmanuella-Aninye",
                    "followers_url": "https://api.github.com/users/Emmanuella-Aninye/followers",
                    "following_url": "https://api.github.com/users/Emmanuella-Aninye/following{/other_user}",
                    "gists_url": "https://api.github.com/users/Emmanuella-Aninye/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/Emmanuella-Aninye/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/Emmanuella-Aninye/subscriptions",
                    "organizations_url": "https://api.github.com/users/Emmanuella-Aninye/orgs",
                    "repos_url": "https://api.github.com/users/Emmanuella-Aninye/repos",
                    "events_url": "https://api.github.com/users/Emmanuella-Aninye/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/Emmanuella-Aninye/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "ellisonbg",
                    "id": 27600,
                    "node_id": "MDQ6VXNlcjI3NjAw",
                    "avatar_url": "https://avatars.githubusercontent.com/u/27600?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/ellisonbg",
                    "html_url": "https://github.com/ellisonbg",
                    "followers_url": "https://api.github.com/users/ellisonbg/followers",
                    "following_url": "https://api.github.com/users/ellisonbg/following{/other_user}",
                    "gists_url": "https://api.github.com/users/ellisonbg/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/ellisonbg/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/ellisonbg/subscriptions",
                    "organizations_url": "https://api.github.com/users/ellisonbg/orgs",
                    "repos_url": "https://api.github.com/users/ellisonbg/repos",
                    "events_url": "https://api.github.com/users/ellisonbg/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/ellisonbg/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "tai271828",
                    "id": 3217432,
                    "node_id": "MDQ6VXNlcjMyMTc0MzI=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/3217432?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/tai271828",
                    "html_url": "https://github.com/tai271828",
                    "followers_url": "https://api.github.com/users/tai271828/followers",
                    "following_url": "https://api.github.com/users/tai271828/following{/other_user}",
                    "gists_url": "https://api.github.com/users/tai271828/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/tai271828/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/tai271828/subscriptions",
                    "organizations_url": "https://api.github.com/users/tai271828/orgs",
                    "repos_url": "https://api.github.com/users/tai271828/repos",
                    "events_url": "https://api.github.com/users/tai271828/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/tai271828/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "EpLiar",
                    "id": 23559565,
                    "node_id": "MDQ6VXNlcjIzNTU5NTY1",
                    "avatar_url": "https://avatars.githubusercontent.com/u/23559565?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/EpLiar",
                    "html_url": "https://github.com/EpLiar",
                    "followers_url": "https://api.github.com/users/EpLiar/followers",
                    "following_url": "https://api.github.com/users/EpLiar/following{/other_user}",
                    "gists_url": "https://api.github.com/users/EpLiar/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/EpLiar/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/EpLiar/subscriptions",
                    "organizations_url": "https://api.github.com/users/EpLiar/orgs",
                    "repos_url": "https://api.github.com/users/EpLiar/repos",
                    "events_url": "https://api.github.com/users/EpLiar/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/EpLiar/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                },
                {
                    "login": "psybuzz",
                    "id": 2322480,
                    "node_id": "MDQ6VXNlcjIzMjI0ODA=",
                    "avatar_url": "https://avatars.githubusercontent.com/u/2322480?v=4",
                    "gravatar_id": "",
                    "url": "https://api.github.com/users/psybuzz",
                    "html_url": "https://github.com/psybuzz",
                    "followers_url": "https://api.github.com/users/psybuzz/followers",
                    "following_url": "https://api.github.com/users/psybuzz/following{/other_user}",
                    "gists_url": "https://api.github.com/users/psybuzz/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/psybuzz/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/psybuzz/subscriptions",
                    "organizations_url": "https://api.github.com/users/psybuzz/orgs",
                    "repos_url": "https://api.github.com/users/psybuzz/repos",
                    "events_url": "https://api.github.com/users/psybuzz/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/psybuzz/received_events",
                    "type": "User",
                    "site_admin": false,
                    "score": 1.0
                }
            ]
}

`;
