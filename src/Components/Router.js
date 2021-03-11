import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom'
import Home from './Home';
import Filter from './Filter'
import Header from './Header'
import Details from './Details'

const Router = () => {
        return(
            <BrowserRouter>
            <Header />
                <Route path="/" component={Home} exact/>
                <Route path="/filter" component={Filter} exact />
                <Route path="/details" component={Details} />
            </BrowserRouter>
        )
    }


export default Router;