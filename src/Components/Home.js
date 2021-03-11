import React from 'react'

import Wallpaper from './Wallpaper'
import QuickSearch from './QuickSearch'
import axios from 'axios'

import '../Styles/home.css'

class Home extends React.Component{

    constructor(){
        super();
        this.state = {
            locations:[],
            mealtypes:[]
        }
    }

    componentDidMount(){

        sessionStorage.setItem('locationId',undefined)

        axios({
            url:'location',
            method:'GET',
            headers:{'Content-Type':'application/json'}
        }).then(res=>{
            this.setState({locations:res.data.locations})
        }).catch(err=> {console.log(err)})

        axios({
            url: 'mealtypes',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({ mealtypes: res.data.mealtypes })
        }).catch(err => { console.log(err) })
    }

    

    render(){
        const {locations,mealtypes} = this.state
        return (
            <div>
               <Wallpaper locations={locations}/>

                <QuickSearch mealtypes={mealtypes} /> 
            </div>
        )
    }
}

export default Home
