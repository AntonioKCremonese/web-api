import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import AutorBox from './modulos/Autor';
import LivroBox from './modulos/Livro';
import Home from './modulos/Home';

ReactDOM.render(
    (<Router >
            <App>
                <Switch>    
                    <Route exact path="/" component={Home}/>
                    <Route path="/autor" component={AutorBox}/>
                    <Route path="/livro" component={LivroBox}/>                
                </Switch>            
            </App>
        </Router>)
    , document.getElementById('root'));


serviceWorker.unregister();
