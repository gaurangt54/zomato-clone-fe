import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'


class Wallpaper extends React.Component {

    constructor(){
        super();
        this.state = {
            restaurants : []
        }
    }

    handleClick = (event) => {
        const resId = event.target.value;
        this.props.history.push(`/details/?restaurant=${resId}`);
    }

    handleChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId',locationId)

        axios({
            method:'GET',
            url:`https://ght-zomato-backend.herokuapp.com/getRestaurantByLocation/${locationId}`,
            headers: { 'Content-Type': 'application/json' },
            
        })
        .then(res => {
            this.setState({
                restaurants: res.data.restaurants
        })
        console.log(res.data.restaurants[0].name)
        }).catch(err => {
            console.log(err)
        })

    }

    


    render() {
        const { locations } = this.props;
        const {restaurants} = this.state;
        return (
            <div style={{'font-family': 'Poppins'}}>
                <img src="./Assets/homepageimg.png" width="100%" height="450" ></img>
                <div>
                    { /*  Adding Logo  */}
                    <div className="logo">
                        <p>e!</p>
                    </div>

                    <div className="headings">
                        Find the best restaurants, cafes, bars
                </div>

                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handleChange}>
                            <option value="0">Select</option>
                            {
                                locations.map((item) => {
                                    return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                })
                            }
                        </select>
                        <div>
                            <span className="glyphicon glyphicon-search search"></span>
                            <select className="restaurantDropdown" onChange={this.handleClick}>
                            {   restaurants.length!== 0?
                                restaurants.map((item) => {
                                    return <option value={item._id}>{item.name}</option>
                                }) :
                                <option value="">No Results Found</option>
                            }
                        </select>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withRouter(Wallpaper) 
